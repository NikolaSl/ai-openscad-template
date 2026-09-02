#!/usr/bin/env python3
"""Repeatable visual/geometric QA for one OpenSCAD entry point."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

import matplotlib.pyplot as plt
import trimesh
from PIL import Image, ImageDraw

VIEWS = {
    "iso": "220,-220,170,0,0,0",
    "top": "0,0,300,0,0,0",
    "bottom": "0,0,-300,0,0,0",
    "front": "0,-300,40,0,0,0",
    "back": "0,300,40,0,0,0",
    "right": "300,0,40,0,0,0",
    "left": "-300,0,40,0,0,0",
}


def run(cmd: list[str], cwd: Path, timeout: int = 300) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                          text=True, check=False, timeout=timeout)


def render_png(src: Path, out: Path, camera: str, cwd: Path) -> str:
    cmd = ["xvfb-run", "-a", "openscad", "--preview=throwntogether", "--projection=o",
           "--autocenter", "--viewall", "--imgsize=900,700", f"--camera={camera}",
           "--view=edges", "-o", str(out), str(src)]
    p = run(cmd, cwd)
    if p.returncode != 0 or not out.exists():
        raise RuntimeError(f"PNG preview failed: {' '.join(cmd)}\n{p.stdout}")
    return p.stdout


def stl_check(src: Path, out: Path, cwd: Path, expected_components: int) -> dict:
    p = run(["openscad", "--render", "--hardwarnings", "-o", str(out), str(src)], cwd)
    text = p.stdout
    if p.returncode != 0 or not out.exists() or out.stat().st_size == 0:
        raise RuntimeError(f"STL render failed for {src}\n{text}")

    simple_match = re.search(r"Simple:\s+(yes|no)", text, re.IGNORECASE)
    simple = None if not simple_match else simple_match.group(1).lower() == "yes"
    if simple is False:
        raise RuntimeError(f"OpenSCAD reports non-simple geometry for {src}\n{text}")

    mesh = trimesh.load_mesh(out, force="mesh")
    if not isinstance(mesh, trimesh.Trimesh) or len(mesh.faces) == 0:
        raise RuntimeError(f"Invalid/empty mesh: {out}")
    components = len(mesh.split(only_watertight=False))
    stats = {
        "simple_log": simple,
        "watertight": bool(mesh.is_watertight),
        "is_volume": bool(mesh.is_volume),
        "components": components,
        "expected_components": expected_components,
        "vertices": int(len(mesh.vertices)),
        "faces": int(len(mesh.faces)),
        "bounds_mm": [float(x) for x in mesh.extents],
        "log": text,
    }
    if not mesh.is_watertight:
        raise RuntimeError(f"Mesh is not watertight: {out}")
    if components != expected_components:
        raise RuntimeError(f"Expected {expected_components} connected component(s), got {components}: {out}")
    return stats


def section_plot(stl: Path, axis: str, out: Path) -> None:
    mesh = trimesh.load_mesh(stl, force="mesh")
    center = mesh.bounding_box.centroid
    normals = {"x": [1, 0, 0], "y": [0, 1, 0], "z": [0, 0, 1]}
    section = mesh.section(plane_origin=center, plane_normal=normals[axis])
    fig, ax = plt.subplots(figsize=(6, 5), dpi=150)
    if section is None:
        ax.text(0.5, 0.5, "No intersection", ha="center", va="center", transform=ax.transAxes)
    else:
        planar, _ = section.to_planar()
        for entity in planar.discrete:
            ax.plot(entity[:, 0], entity[:, 1], linewidth=1.3)
    ax.set_aspect("equal", adjustable="box")
    ax.grid(True, linewidth=0.35)
    ax.set_xlabel("section u (mm)")
    ax.set_ylabel("section v (mm)")
    ax.set_title(f"Center section normal to {axis.upper()}")
    fig.tight_layout()
    fig.savefig(out)
    plt.close(fig)


def contact_sheet(images: list[tuple[str, Path]], out: Path) -> None:
    cells = []
    for label, path in images:
        image = Image.open(path).convert("RGB")
        image.thumbnail((420, 320))
        canvas = Image.new("RGB", (440, 370), "white")
        canvas.paste(image, ((440-image.width)//2, 30+(320-image.height)//2))
        ImageDraw.Draw(canvas).text((12, 8), label, fill="black")
        cells.append(canvas)
    cols = 3
    rows = (len(cells)+cols-1)//cols
    sheet = Image.new("RGB", (cols*440, rows*370), "white")
    for i, cell in enumerate(cells):
        sheet.paste(cell, ((i%cols)*440, (i//cols)*370))
    sheet.save(out)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("scad")
    parser.add_argument("--name")
    parser.add_argument("--out", default="build/qa")
    parser.add_argument("--expected-components", type=int, default=1)
    parser.add_argument("--preview-only", action="store_true",
                        help="Skip full STL/mesh and sections; intended for integrated assemblies.")
    args = parser.parse_args()

    root = Path.cwd().resolve()
    src = Path(args.scad).resolve()
    name = args.name or src.stem
    outdir = root / args.out / name
    outdir.mkdir(parents=True, exist_ok=True)

    stats, rendered = {}, []
    if not args.preview_only:
        stl = outdir / f"{name}.stl"
        stats = stl_check(src, stl, root, args.expected_components)

    for view, camera in VIEWS.items():
        path = outdir / f"{view}.png"
        render_png(src, path, camera, root)
        rendered.append((view, path))

    if not args.preview_only:
        for axis in ("x", "y", "z"):
            path = outdir / f"section-{axis}.png"
            section_plot(stl, axis, path)
            rendered.append((f"section {axis.upper()}", path))

    contact_sheet(rendered, outdir / "contact-sheet.png")
    report = {k: v for k, v in stats.items() if k != "log"}
    report.update({"source": str(src.relative_to(root)),
                   "mode": "preview-only" if args.preview_only else "full",
                   "views": list(VIEWS),
                   "sections": [] if args.preview_only else ["x", "y", "z"]})
    (outdir / "qa.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(outdir / "contact-sheet.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
