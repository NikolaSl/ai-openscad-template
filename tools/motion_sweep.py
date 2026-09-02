#!/usr/bin/env python3
"""Generic OpenSCAD motion/parameter sweep backbone.

This checks compile/assertion validity over each configured axis and explicit coupled
configurations, and renders representative human-review poses. Project-specific mesh
collision/distance analyzers can be layered on top when needed.
"""
from __future__ import annotations

import argparse
import itertools
import json
import math
import subprocess
from pathlib import Path


def run(cmd: list[str], cwd: Path, timeout: int) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                          text=True, check=False, timeout=timeout)


def values_inclusive(start: float, stop: float, step: float) -> list[float]:
    if step <= 0 or stop < start:
        raise ValueError("motion axis requires min <= max and positive step")
    values, x = [], start
    eps = abs(step) * 1e-9 + 1e-9
    while x <= stop + eps:
        values.append(round(x, 10))
        x += step
    if not math.isclose(values[-1], stop, rel_tol=0, abs_tol=eps):
        values.append(stop)
    return values


def define_args(values: dict[str, float]) -> list[str]:
    args = []
    for name, value in values.items():
        args.extend(["-D", f"{name}={value}"])
    return args


def is_fatal(p: subprocess.CompletedProcess[str]) -> bool:
    tokens = ("ERROR:", "Parser error", "Can't parse file", "Assertion")
    return p.returncode != 0 or any(token in p.stdout for token in tokens)


def compile_pose(root: Path, entry: Path, outdir: Path, values: dict[str, float], label: str, timeout: int) -> dict:
    out = outdir / f"compile-{label}.csg"
    p = run(["openscad", *define_args(values), "-o", str(out), str(entry)], root, timeout)
    ok = not is_fatal(p) and out.exists() and out.stat().st_size > 0
    out.unlink(missing_ok=True)
    return {"label": label, "values": values, "status": "OK" if ok else "ERROR",
            "log_tail": "\n".join(p.stdout.strip().splitlines()[-12:])}


def render_pose(root: Path, entry: Path, outdir: Path, values: dict[str, float], label: str,
                camera: str, timeout: int) -> dict:
    out = outdir / f"pose-{label}.png"
    cmd = ["xvfb-run", "-a", "openscad", "--preview=throwntogether", "--projection=o",
           "--autocenter", "--viewall", "--imgsize=900,700", f"--camera={camera}",
           "--view=edges", *define_args(values), "-o", str(out), str(entry)]
    p = run(cmd, root, timeout)
    ok = not is_fatal(p) and out.exists() and out.stat().st_size > 0
    return {"label": label, "values": values, "status": "OK" if ok else "ERROR",
            "file": str(out.relative_to(root)) if out.exists() else None,
            "log_tail": "\n".join(p.stdout.strip().splitlines()[-12:])}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", required=True)
    parser.add_argument("--out", default="build/motion-qa")
    parser.add_argument("--timeout", type=int, default=180)
    args = parser.parse_args()

    root = Path.cwd().resolve()
    plan = json.loads((root / args.plan).read_text(encoding="utf-8"))
    entry = (root / plan["entrypoint"]).resolve()
    outdir = (root / args.out).resolve()
    outdir.mkdir(parents=True, exist_ok=True)
    axes = plan.get("axes", [])
    references = {axis["name"]: axis.get("reference", axis["min"]) for axis in axes}

    checks = []
    for axis in axes:
        for value in values_inclusive(axis["min"], axis["max"], axis["step"]):
            pose = dict(references)
            pose[axis["name"]] = value
            checks.append(compile_pose(root, entry, outdir, pose,
                                       f"{axis['name']}-{value:g}".replace("-", "m").replace(".", "p"),
                                       args.timeout))

    for i, sample in enumerate(plan.get("coupled_samples", [])):
        pose = dict(references)
        pose.update(sample)
        checks.append(compile_pose(root, entry, outdir, pose, f"coupled-{i:03d}", args.timeout))

    camera = plan.get("camera", "220,-220,170,0,0,0")
    renders = []
    for i, sample in enumerate(plan.get("review_samples", [])):
        pose = dict(references)
        pose.update(sample)
        renders.append(render_pose(root, entry, outdir, pose, f"review-{i:03d}", camera, args.timeout))

    failures = [x for x in checks + renders if x["status"] != "OK"]
    report = {
        "protocol": "MOTION_QA_PROTOCOL.md",
        "plan": args.plan,
        "entrypoint": str(entry.relative_to(root)),
        "axis_sweeps": axes,
        "compile_checks": checks,
        "review_renders": renders,
        "result": "PASS" if not failures else "FAIL",
        "failures": failures,
        "note": "PASS proves configured poses compile and OpenSCAD assertions hold. Add project-specific collision/distance analysis when required by the motion contract.",
    }
    (outdir / "motion-qa.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    summary = ["# Motion QA run", "", f"Result: **{report['result']}**", "",
               f"Entry: `{report['entrypoint']}`", f"Compile samples: {len(checks)}",
               f"Review renders: {len(renders)}", "", report["note"]]
    (outdir / "SUMMARY.md").write_text("\n".join(summary) + "\n", encoding="utf-8")
    print(json.dumps({"result": report["result"], "compile_samples": len(checks),
                      "review_renders": len(renders), "failures": len(failures)}, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
