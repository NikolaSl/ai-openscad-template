#!/usr/bin/env python3
"""Generic dense mesh collision/distance sweep for a single rigid DOF.

OpenSCAD exports the reference-pose moving body and fixed obstruction meshes once.
Python-FCL then transforms the moving mesh across a dense rotation/translation sweep.
This avoids repeatedly invoking expensive CAD booleans for every sampled pose.
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
from pathlib import Path

import numpy as np
import trimesh
from trimesh.collision import CollisionManager
from trimesh.transformations import rotation_matrix, translation_matrix


def run(cmd: list[str], cwd: Path, timeout: int = 300) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                          text=True, check=False, timeout=timeout)


def values_inclusive(start: float, stop: float, step: float) -> list[float]:
    if step <= 0 or stop < start:
        raise ValueError("motion requires min <= max and positive step")
    values, x = [], start
    eps = abs(step) * 1e-9 + 1e-9
    while x <= stop + eps:
        values.append(round(x, 10))
        x += step
    if not math.isclose(values[-1], stop, rel_tol=0, abs_tol=eps):
        values.append(stop)
    return values


def export_mesh(root: Path, outdir: Path, name: str, scad: str) -> tuple[trimesh.Trimesh, dict]:
    src = (root / scad).resolve()
    out = outdir / f"{name}.stl"
    p = run(["openscad", "--render", "--hardwarnings", "-o", str(out), str(src)], root)
    if p.returncode != 0 or not out.exists() or out.stat().st_size == 0:
        raise RuntimeError(f"OpenSCAD export failed for {name}:\n{p.stdout}")
    mesh = trimesh.load_mesh(out, force="mesh", process=False)
    if not isinstance(mesh, trimesh.Trimesh) or len(mesh.faces) == 0:
        raise RuntimeError(f"Invalid mesh for {name}")
    return mesh, {
        "source": str(src.relative_to(root)),
        "stl": str(out.relative_to(root)),
        "vertices": int(len(mesh.vertices)),
        "faces": int(len(mesh.faces)),
        "watertight": bool(mesh.is_watertight),
        "bounds_mm": [float(x) for x in mesh.extents],
        "openscad_log_tail": "\n".join(p.stdout.strip().splitlines()[-12:]),
    }


def transform_for(motion: dict, value: float) -> np.ndarray:
    kind = motion["type"]
    axis = np.asarray(motion["axis"], dtype=float)
    norm = np.linalg.norm(axis)
    if norm <= 0:
        raise ValueError("motion axis vector must be nonzero")
    axis = axis / norm
    if kind == "rotation":
        origin = np.asarray(motion.get("origin", [0, 0, 0]), dtype=float)
        return rotation_matrix(math.radians(value), axis, point=origin)
    if kind == "translation":
        return translation_matrix(axis * value)
    raise ValueError(f"unsupported motion type: {kind}")


def sweep(moving: trimesh.Trimesh, fixed: trimesh.Trimesh, motion: dict,
          minimum_clearance: float, name: str) -> dict:
    manager = CollisionManager()
    manager.add_object(name, fixed)
    samples, collisions, clearance_failures = [], [], []
    min_distance, min_value = math.inf, None
    values = values_inclusive(motion["min"], motion["max"], motion["step"])
    for value in values:
        transform = transform_for(motion, value)
        hit = bool(manager.in_collision_single(moving, transform=transform))
        distance = float(manager.min_distance_single(moving, transform=transform))
        clear = (not hit) and distance >= minimum_clearance
        samples.append({"value": value, "collision": hit, "distance_mm": distance,
                        "required_clearance_mm": minimum_clearance, "clearance_ok": clear})
        if hit:
            collisions.append(value)
        if not clear:
            clearance_failures.append(value)
        if distance < min_distance:
            min_distance, min_value = distance, value
    return {
        "name": name,
        "sample_count": len(samples),
        "motion_min": motion["min"],
        "motion_max": motion["max"],
        "step": motion["step"],
        "minimum_required_clearance_mm": minimum_clearance,
        "minimum_distance_mm": min_distance,
        "minimum_distance_at": min_value,
        "collision_values": collisions,
        "clearance_failure_values": clearance_failures,
        "status": "CLEAR" if not clearance_failures else "FAIL",
        "samples": samples,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", required=True)
    parser.add_argument("--out", default="build/mesh-motion-qa")
    args = parser.parse_args()

    root = Path.cwd().resolve()
    plan = json.loads((root / args.plan).read_text(encoding="utf-8"))
    outdir = (root / args.out).resolve()
    outdir.mkdir(parents=True, exist_ok=True)

    moving_cfg = plan["moving"]
    moving, moving_meta = export_mesh(root, outdir, moving_cfg["name"], moving_cfg["scad"])
    results, fixed_meta = [], {}
    for fixed_cfg in plan["fixed"]:
        fixed, meta = export_mesh(root, outdir, fixed_cfg["name"], fixed_cfg["scad"])
        fixed_meta[fixed_cfg["name"]] = meta
        results.append(sweep(moving, fixed, plan["motion"],
                             float(fixed_cfg.get("minimum_clearance_mm", 0.0)),
                             fixed_cfg["name"]))

    failures = [result for result in results if result["status"] != "CLEAR"]
    report = {
        "protocol": "MOTION_QA_PROTOCOL.md",
        "plan": args.plan,
        "moving_mesh": moving_meta,
        "fixed_meshes": fixed_meta,
        "motion": plan["motion"],
        "checks": results,
        "result": "PASS" if not failures else "FAIL",
        "limitations": [
            "This generic engine models one rigid rotational or translational DOF.",
            "Complex linkages/multi-axis kinematics require a project-specific transform adapter or multiple staged checks.",
            "Flexible cables/hoses and physical backlash/compliance remain separate validation unless explicitly modeled."
        ]
    }
    (outdir / "mesh-motion-qa.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    lines = ["# Mesh motion QA", "", f"Result: **{report['result']}**", "",
             f"Motion: {plan['motion']['type']} {plan['motion']['min']}..{plan['motion']['max']} step {plan['motion']['step']}", ""]
    for result in results:
        lines += [f"- `{result['name']}`: {result['status']}; minimum distance {result['minimum_distance_mm']:.3f} mm at {result['minimum_distance_at']}; required {result['minimum_required_clearance_mm']:.3f} mm."]
    lines += ["", "See `mesh-motion-qa.json` for every sampled pose and limitations."]
    (outdir / "SUMMARY.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"result": report["result"], "checks": len(results), "failures": len(failures)}, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
