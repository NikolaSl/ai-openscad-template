# Visual and Geometric QA Protocol

Every elementary mechanical part must be inspected from enough independent evidence that a wrong model cannot easily look correct from one attractive angle.

## 1. Full geometry gate for printable parts

For an elementary printable part:

- full OpenSCAD render/export with hard warnings;
- successful STL generation;
- manifold/simple geometry where the backend reports it;
- watertight mesh;
- expected connected-component count;
- plausible bounding box and orientation.

A compile success alone is not QA.

## 2. Mandatory visual views

Generate at least:

```text
isometric
top
bottom
front
back
left
right
```

Use consistent orientation and auto-fit so unexpected inversion/mirroring is visible.

## 3. Mandatory center sections

Where meaningful, generate center sections normal to:

```text
X
Y
Z
```

Add offset/critical sections through bearing seats, nut traps, screw channels, shaft bores, gear planes, clips, thin walls and hidden interfaces. Center cuts are the minimum, not the maximum.

## 4. Neighbor/context QA

Render the new part together with every already validated directly interacting neighbor. Check:

- collisions and unintended gaps;
- common-axis/hole alignment;
- shaft/bearing engagement;
- gear/belt/chain plane alignment;
- fastener head/nut/washer paths;
- screw length and insertion direction;
- tool reach;
- assembly sequence feasibility;
- removal/service path;
- minimum material around holes/pockets;
- intended contact surfaces;
- cables/flexible paths when relevant.

## 5. Assembly QA

After part acceptance, integrate into the current partial/full machine and inspect the new boundary in assembled context. Large assemblies do not need to be boolean-unioned merely for review; individual printable parts remain responsible for full mesh QA.

## 6. Moving geometry

If a part/assembly moves, static views are insufficient. Follow `MOTION_QA_PROTOCOL.md`. Check both endpoints, the full intended range, critical clearances and coupled-axis states.

## 7. Evidence and reproducibility

QA tooling should generate:

- exported STL in full mode;
- standard PNG views;
- X/Y/Z section images;
- contact sheet;
- machine-readable `qa.json`;
- relevant logs.

Generated artifacts may remain under `build/` and need not be committed. The scripts/commands required to regenerate them **must** be committed.

## 8. Failure/backtracking

If QA exposes a local modeling error, revise the part and repeat. If it exposes an upstream interface problem, use the controlled backtracking/invalidation rules in `DESIGN_PROTOCOL.md` and `INTERFACES.md`.

## Template tool

Run:

```bash
python3 tools/visual_qa.py src/parts/example_part.scad
```

Use `--preview-only` for large assemblies whose individual printable parts already passed full QA.
