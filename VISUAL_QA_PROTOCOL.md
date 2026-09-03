# Visual and Geometric QA Protocol

Every elementary mechanical part must be inspected from enough independent evidence that a wrong model cannot easily look correct from one attractive angle. Use this together with `MECHANICAL_INTEGRITY_PROTOCOL.md` and `MOTION_QA_PROTOCOL.md`.

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

## 3. Mandatory center and critical sections

Where meaningful, generate center sections normal to X/Y/Z. Add offset/critical sections through bearing seats, nut traps, screw channels, shaft bores, gear planes, clips, thin walls, supports, fastener stacks and hidden interfaces.

If a collision/clearance is hidden, generate a section through the actual body pair; do not rely only on translucent or attractive external views.

## 4. Neighbor/context QA must include physical hardware

Render the new part with every directly interacting validated neighbor **and every purchased/fabricated solid envelope that can interfere**, such as shafts, bearings, screw heads/shanks, nuts, washers, inserts, motors, payload adapters and connectors.

Check:

- forbidden solid overlap and required clearance;
- intended contact/fit/passage relationships;
- common-axis/hole alignment;
- shaft/bearing engagement;
- gear/belt/chain plane alignment;
- fastener head/nut/washer paths;
- screw length/thread engagement and insertion direction;
- anti-rotation/retention features;
- tool reach;
- assembly sequence feasibility;
- removal/service path;
- minimum material around holes/pockets;
- cables/flexible paths when relevant.

A hole center alone is not a complete fastener model when the head, nut, washer or protruding shank can collide.

## 5. Support / constraint / load-path visual review

Visual QA must also make the real mechanical constraint chain inspectable. For every major installed body/subassembly ask:

- what supports radial, axial and gravity loads?
- what reacts drive torque?
- what prevents unintended translations/rotations?
- what retains the body at end limits?
- are support locations sufficiently separated for the intended moment load?
- does a service cover accidentally carry a structural reaction?
- are motor/gear shafts or thin printed walls carrying load unintentionally?
- can realistic manufacturing tolerances make redundant constraints fight each other?

Use cutaways/sections/exploded context views when supports or retainers are hidden.

A CAD transform is not visual evidence of a real mechanism. The bearings, shafts, rails, guides, slots, pivots, locators and retention elements enforcing the path must be visible or otherwise documented in `INTERFACES.md`.

## 6. Assembly QA and internal solid pairs

After part acceptance, integrate into the current partial/full machine and inspect every newly touched boundary.

Do **not** assume bodies are mutually clear merely because they share one assembly transform. Internal same-transform pairs still require solid-pair QA. Intentional contact/fit pairs are explicit exceptions; otherwise physical overlap is forbidden.

Large assemblies need not be boolean-unioned merely for review; individual parts remain responsible for full mesh QA while pairwise/interface/state-space tools handle physical interaction proof.

## 7. Moving and adjustable geometry

Static views are insufficient when geometry changes with state. Follow `MOTION_QA_PROTOCOL.md` over:

```text
operational DOFs
× adjustment coordinates/DOFs
× relevant discrete configurations
× relevant service/setup states
```

Check endpoints, complete justified sweeps, coupled states, closest-clearance states and internal body pairs. If a manual setup has residual free DOFs, state the operator/fixture constraint and do not depict the CAD parameter as a self-guided mechanism.

## 8. Evidence and reproducibility

QA tooling should generate as applicable:

- exported STL in full mode;
- standard PNG views;
- X/Y/Z and critical section images;
- contact sheet;
- machine-readable `qa.json`;
- pairwise collision/distance evidence;
- relevant logs;
- critical state/constraint review poses.

Generated artifacts may remain under `build/` and need not be committed. The source, contracts and scripts/commands required to regenerate them **must** be committed.

## 9. Failure/backtracking

If QA exposes a local modeling error, revise the part and repeat. If it exposes an upstream interface, support, constraint, solid-relation or motion-state problem, use controlled backtracking/invalidation and repeat the complete affected QA scope.

## Template tool

Run:

```bash
python3 tools/visual_qa.py src/parts/example_part.scad
```

Use `--preview-only` for large assemblies whose individual printable parts already passed full QA; preview-only is not permission to skip interface/solid/constraint/state-space checks.
