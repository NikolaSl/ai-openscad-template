# Parametric Mechanical Design Protocol

This protocol is project-agnostic. It is the default workflow for complex parametric mechanical devices.

## Core principle

Never generate a complex machine as one opaque model. First decompose it into elementary parts, define their interactions, establish one shared parameter system, then generate and validate parts incrementally in dependency order. Every new part is designed in the context of the whole machine and the already validated neighbors. If the next part cannot be made compatible, backtrack to the nearest upstream blocking decision, correct it, invalidate affected descendants and re-run QA.

## A. Plan the machine before detailed geometry

### A1. Requirements

Record intended function, loads/moments, motion ranges, size/weight limits, mounting interfaces, fixed purchased hardware, material/manufacturing assumptions, serviceability, backlash/fit requirements, cable paths, safety constraints and tool access.

### A2. Complete part decomposition

Create the initial complete list of elementary parts **before designing them in detail**. For each part record:

- stable ID and responsibility;
- printed / purchased / fabricated;
- what it supports or drives;
- neighbors and important interfaces;
- expected degrees of freedom;
- dependencies;
- current status.

The goal is a global machine plan, not premature local geometry.

### A3. Interaction graph before geometry

For every neighboring pair define the interface semantically, e.g. fixed with 4×M3, Ø8 shaft through 608 bearings, gear mesh 4:1, removable cover with ≥1 mm clearance, tool access from +Y, cable must avoid swept volume.

Store these contracts in `INTERFACES.md` with stable IDs.

## B. Shared parameter architecture

Create `src/config.scad` before detailed part generation. Shared dimensions must have one owner and must not be copied as unrelated magic numbers into multiple parts.

Typical parameter families:

- machine envelope and payload assumptions;
- standard hardware envelopes;
- bearings/shafts/motors;
- wall/rib thicknesses;
- printer fit allowances;
- sliding/rotating clearances;
- fastener holes/nut pockets/inserts;
- axis datums and interface datums;
- motion limits;
- service/tool clearances.

Prefer derived values over duplication.

## C. Dependency/build order

Model in dependency order, not visual/alphabetical order. Start with reference geometry and high-fanout datums, then move outward.

Typical order:

```text
reference/base
→ axes/bearing supports
→ moving platforms
→ structural supports
→ drive interfaces
→ motor/gear mounts
→ covers/guards
→ cable management
→ accessories
```

Before part N, explicitly identify global parameters, validated neighbors, required interfaces, swept volumes to avoid and later dependents.

## D. One elementary part at a time

Design context is always:

```text
requirements
+ complete part plan
+ interface graph
+ shared parameters
+ validated neighboring geometry
+ known future interfaces
```

Rules:

1. Use common parameters/datums.
2. Render validated neighbors or simplified envelopes in context.
3. Encode important invariants with `assert()` where practical.
4. Consider manufacturability, print orientation, assembly order and tool access.
5. Do not casually redefine a validated upstream interface.

## E. Per-part QA

A part becomes a trusted dependency only after the loop in `VISUAL_QA_PROTOCOL.md`:

- full render/export;
- mesh validity/manifold/watertight checks;
- all standard orthographic/isometric views;
- X/Y/Z and critical offset sections;
- neighboring-part context;
- fastener/assembly/service checks;
- motion checks where relevant.

## F. Integration gate

After a part passes individual QA:

1. add it to the best-known partial/full assembly;
2. inspect touched interfaces;
3. run relevant clearance/assertion checks;
4. run motion QA if motion envelope changes;
5. update status ledger, interfaces, assembly/BOM and project state;
6. only then allow downstream geometry to depend on it.

The project must always have a coherent best-known partial machine, not a directory of unrelated finished-looking parts.

## G. Controlled recursive backtracking

When the next part has no clean solution:

1. name the blocking interface/constraint;
2. identify its nearest upstream owner;
3. change the smallest upstream decision that resolves the problem;
4. mark every affected dependent part/interface `NEEDS_REVALIDATION`;
5. re-QA the changed owner;
6. propagate QA outward in dependency order;
7. resume forward design only after the partial assembly is coherent.

Backtracking is **minimal in scope, complete in validation**.

## H. Human-in-the-loop

Automation must remain inspectable. Human review is mandatory at major subsystem boundaries, before expensive prints, after major backtracking and before changing a high-fanout interface.

## I. Physical feedback loop

CAD cannot prove printer fit, material stiffness, torque, backlash or assembly feel. Identify physical coupons/prototypes for fits, bearings/shafts, nut traps/inserts, couplers/gears, snap fits, friction surfaces and loaded structures. Record raw measurements in `CALIBRATION.md`, then modify shared parameters and invalidate/re-QA affected dependencies.

## Suggested part state machine

```text
PLANNED
→ INTERFACES_DEFINED
→ READY_TO_MODEL
→ MODELED
→ PART_QA_PASS
→ INTEGRATED_CAD
→ ASSEMBLY_QA_PASS
→ TRUSTED_DEPENDENCY
→ PHYSICAL_VERIFY
→ FROZEN
```

Exceptional states: `BLOCKED`, `NEEDS_BACKTRACK`, `NEEDS_REVALIDATION`, `HUMAN_REVIEW`, `PHYSICAL_FIT_TEST_REQUIRED`.

## Compact algorithm

```text
1 Specify machine.
2 Decompose entire machine without detailed part design.
3 Define interface graph.
4 Create shared parameter architecture.
5 Determine dependency order.
6 Select next ready elementary part.
7 Design it from global parameters + validated neighbors.
8 Run geometric/visual/section/context/motion QA.
9 If local QA fails, revise same part and repeat.
10 If interfaces cannot be satisfied, backtrack to nearest blocking owner.
11 Invalidate and re-QA affected descendants.
12 Integrate accepted part into current assembly and update BOM/state.
13 Stop for human review at major gates.
14 Repeat until machine is coherent.
15 Run physical fit/load/motion tests and feed results back into parameters.
16 Freeze production geometry/BOM only after required physical verification.
```
