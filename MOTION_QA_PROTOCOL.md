# Motion QA Protocol

A mechanism is not motion-QA-passed because it looks correct in a neutral pose or a few screenshots.

> Every degree of freedom must be validated over its complete intended motion envelope, including both limits, intermediate configurations, known worst cases and relevant coupled positions with other moving axes.

## 1. Motion contract

For every DOF record a stable motion ID, moving assembly, fixed/reference assembly, axis/datum, minimum/maximum, periodic/wrap behavior, normal versus hard limits, minimum clearance, collision-sensitive interfaces, cable/flexible constraints and coupling with other axes.

Motion limits/datums belong in shared parameters/contracts, not duplicated QA constants.

## 2. Mandatory configurations

Always inspect:

- minimum limit;
- maximum limit;
- neutral/reference;
- kinematic transition points;
- known worst collision positions;
- closest-clearance/tangent positions;
- maximum cable bend/twist/extension positions.

## 3. Sweep the full range

Named poses are human-review checkpoints, not a substitute for an automated/repeatable sweep. Sample each one-dimensional motion from minimum to maximum at a justified interval. Refine near small clearances, contacts, singularities, over-center states or complicated geometry.

Initial engineering steps such as 2–5° rotational or 0.5–2 mm linear may be useful starting points, but they are not universal acceptance limits.

## 4. Check every sampled state

Where applicable verify:

- moving↔fixed collision;
- moving↔moving collision;
- self-intersection;
- minimum clearance;
- fastener/washer/head clearance;
- bearing/shaft relationships;
- gear/belt/chain alignment;
- guard/cover clearance;
- service/tool clearance;
- cable/hose bend/twist/extension;
- connector strain;
- hard-stop engagement/overtravel;
- payload/counterweight clearance;
- interface-specific invariants.

Encode critical invariants as executable `assert()` checks where practical.

## 5. Swept volume

When possible, supplement sampling with swept-volume/envelope reasoning. No non-contact fixed object may intrude into the swept volume after required safety clearance. This is particularly useful for rotating arms, payloads, counterweights, linkages, folding structures and cable carriers.

## 6. Multiple DOFs

Testing axes independently is insufficient. Check configuration-space corners, each axis at limits while others are critical/reference, normal coupled trajectories, known worst combinations and singular/near-singular configurations. Periodic axes must include full revolution and wrap transition.

If exhaustive Cartesian sampling is too expensive, use justified adaptive/critical sampling and document what is not exhaustive.

## 7. Visual evidence

Retain/regenerate both limits, reference, representative intermediates, closest-clearance poses, any refined failure boundary, and cutaway/section views when motion is hidden.

## 8. Pass criteria

Mark `MOTION_QA_PASS` only when:

1. motion contract is defined;
2. both limits are checked;
3. the full range is swept with justified resolution;
4. critical multi-axis combinations are checked;
5. no unintended collision is found;
6. required clearances remain valid;
7. flexible elements remain valid if present;
8. hard stops/overtravel are understood where relevant;
9. interfaces remain coherent throughout motion;
10. procedure/evidence is reproducible from repository-controlled source/tools.

## 9. Failure/backtracking

Record failing motion ID/configuration, identify the interface/parameter owner, backtrack to the nearest resolvable upstream decision, mark affected dependencies `NEEDS_REVALIDATION`, revise, re-run per-part QA, then repeat the **complete affected motion sweep**, not only the previously failing pose.

## 10. Invalidation

Any change to moving shape, axis, limit, neighboring clearance, payload envelope, cable path or support relationship invalidates the relevant motion checkpoint.

The generic `tools/motion_sweep.py` supplied by this template automates parameter sweeps, coupled compile checks, assertion execution and representative renders. Project-specific collision/distance adapters should be added when geometry requires stronger proof than OpenSCAD assertions/pose compilation.
