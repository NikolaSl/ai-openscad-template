# Motion QA Protocol

A mechanism is not motion-QA-passed because it looks correct in a neutral pose or a few screenshots.

> Every mechanically relevant state variable must be validated over its complete intended range/state set, including both limits, intermediate configurations, known worst cases and relevant coupled combinations.

Use this protocol together with `MECHANICAL_INTEGRITY_PROTOCOL.md`. Motion QA covers geometry through state space; the integrity protocol additionally requires that the desired trajectory is physically constrained and supported.

## 1. Motion/state contract

For every operational or adjustment state variable record a stable ID, moving body/assembly or precisely the coordinate being varied, fixed/reference bodies, axis/path datum, min/max or discrete states, periodic behavior, normal versus hard limits, minimum clearance, collision-sensitive interfaces, flexible-element constraints, coupling, retention/end-stop behavior, and the **physical constraint chain that enforces every claimed autonomous/repeatable DOF**.

A CAD `translate()` or `rotate()` does not prove a realizable mechanism. Bearings, shafts, hinges, rails, slots, guides, linkages, flexures or other real constraints must account for unwanted rigid-body DOFs.

If a setup state relies on a human, jig, gravity/friction or another external constraint, record that explicitly. A QA parameter may still sweep a coordinate that real geometry constrains, but it must not imply that all other body DOFs are constrained. Example: a screw center can follow a slot while the attached payload still yaws around the screw. If self-guided/repeatable one-dimensional motion is required, add an anti-rotation guide, second locator, carriage/rail or equivalent real constraint.

## 2. Complete configuration space

The QA state space is not limited to motorized axes:

```text
operational DOFs
× adjustment coordinates / DOFs
× discrete configurations
× relevant assembly/service states
```

Include balancing slots, telescopic settings, movable clamps, focus travel, counterweights, tensioners, alternate adapters, removable guards where they affect support/clearance, and other mechanically relevant states.

Endpoints are mandatory. If exhaustive Cartesian sampling is too expensive, use documented critical combinations, adaptive refinement, conservative envelopes and swept-volume/analytic proofs. Never silently ignore an adjustment because it shares the same operational transform as another body.

For manual setup states with residual free DOFs, model the relevant residual envelope conservatively or state exactly which orientation/position is operator-controlled and what the QA does and does not prove.

## 3. Mandatory configurations

Always inspect:

- minimum limit;
- maximum limit;
- neutral/reference;
- kinematic transition points;
- known worst collision positions;
- closest-clearance/tangent positions;
- hard-stop/retention states;
- maximum cable bend/twist/extension positions;
- adjustment extremes combined with critical operational poses when relevant.

## 4. Sweep the full range

Named poses are human-review checkpoints, not a substitute for an automated/repeatable sweep. Sample each one-dimensional variable from minimum to maximum at a justified interval. Refine near small clearances, contacts, singularities, over-center states or complicated geometry.

Initial engineering steps such as 2–5° rotational or 0.5–2 mm linear may be useful starting points, but they are not universal acceptance limits.

## 5. Three levels of automated motion QA

Use the strongest level applicable. They complement one another.

### Level A — parameter/compile/assertion sweep

`tools/motion_sweep.py` drives OpenSCAD parameters through configured ranges, explicit coupled samples and representative review poses.

It verifies compilation, executable `assert()` invariants, endpoints/coupled checkpoints and reproducible visual evidence.

### Level B — dense rigid-mesh collision and distance sweep

`tools/mesh_motion_qa.py` exports collision bodies once, then uses `trimesh` + `python-fcl` to evaluate dense state sweeps without repeatedly invoking CAD booleans.

Use it for every simple rigid DOF or adjustment coordinate that can be represented by a rigid transform. A `moving` body may be checked against any relevant fixed body, including **another body in the same operational subassembly** when testing internal interference.

### Level C — project-specific state-space / kinematics proof

Complex linkages, multiple independently moving solids, multi-dimensional adjustment×operation grids, cable chains, changing-shape mechanisms, residual setup DOFs or special symmetry arguments require a project-specific adapter.

Examples:

- multiple moving meshes with distinct transforms;
- full operational × adjustment configuration-space grids;
- pairwise collision classification;
- residual yaw/orientation envelopes during manual setup;
- adaptive refinement around clearance boundaries;
- conservative collision envelopes;
- swept-volume construction;
- explicit cable/hose models;
- symmetry/analytic proofs.

Do not weaken the contract to fit the generic tool. Add a Level C adapter when needed.

## 6. Pairwise solid checks at every sampled state

Apply the body-pair relationship classifications from `MECHANICAL_INTEGRITY_PROTOCOL.md`.

Verify where applicable:

- every `FORBIDDEN_OVERLAP` pair;
- every `CLEARANCE` pair and its required distance;
- intended contact/fit/passage relationships;
- moving↔fixed collision;
- moving↔moving collision;
- **internal same-transform collisions**;
- self-intersection;
- fastener/washer/head/nut clearance;
- bearing/shaft relationships;
- gear/belt/chain alignment;
- guard/cover clearance;
- service/tool clearance;
- cable/hose bend/twist/extension;
- connector strain;
- hard-stop/overtravel behavior;
- payload/counterweight clearance;
- interface-specific invariants.

Do not hide internal collisions by unioning all bodies in a moving group. Intentional contacts are explicit exceptions; all other physical solid overlap is forbidden.

## 7. Constraint coherence throughout motion

Collision-free geometry is not enough. Verify that every claimed operational state remains mechanically constrained as intended:

- bearings stay seated/coaxial;
- shafts remain radially and axially retained;
- sliders remain captured by their actual guides/slots/rails;
- pivots remain supported on their intended axes;
- fasteners/locators prevent unwanted DOFs only where they physically can;
- end stops actually bound the documented travel;
- service/configuration states do not remove required support unexpectedly.

For manual setup states, verify only the constraints actually provided by the mechanism and explicitly record operator/fixture roles plus residual DOFs. Do not call a manually held adjustment a self-guided DOF.

Underconstraint and overconstraint are both failures when they violate the intended functional contract.

## 8. Swept volume

When possible, supplement sampling with swept-volume/envelope reasoning. No non-contact body may intrude into the clearance-expanded swept volume. This is useful for rotating arms, knobs/handles, payloads, counterweights, linkages, folding structures and cable carriers.

## 9. Multiple variables

Testing variables independently is insufficient. Check configuration-space corners, each variable at limits while others are critical/reference, normal coupled trajectories, known worst combinations, singular states and wrap transitions.

For adjustment variables whose geometry can interact with operational motion, test the coupled operational × adjustment space at an appropriate resolution or provide a conservative proof. If residual setup DOFs can alter interference, include their envelope/state or explicitly restrict the setup procedure.

## 10. Visual evidence

Retain/regenerate both limits, reference, representative intermediates, adjustment extremes, closest-clearance states, refined failure boundaries, and cutaway/section views when motion is hidden.

## 11. Pass criteria

Mark `MOTION_QA_PASS` only when:

1. operational and adjustment/configuration contracts are defined;
2. physical constraint chains are defined for claimed autonomous/repeatable DOFs;
3. manual setup variables explicitly identify residual DOFs and external/operator constraints;
4. all endpoints are checked;
5. complete affected ranges are swept with justified resolution;
6. critical coupled combinations are checked;
7. no forbidden solid intersection exists at the chosen proof level;
8. required clearances remain valid;
9. internal same-transform body pairs were not omitted;
10. flexible elements remain valid if present;
11. hard stops/retention are understood;
12. support/guide coherence remains valid throughout claimed operational motion;
13. proof limitations are explicit;
14. procedure/evidence is reproducible from repository-controlled source/tools.

## 12. Failure/backtracking

Record the failing state ID/configuration, identify the owning interface/constraint/parameter, backtrack to the nearest resolvable upstream decision, mark affected dependencies `NEEDS_REVALIDATION`, revise, re-run per-part QA, then repeat the **complete affected state-space sweep**, not only the failing pose.

## 13. Invalidation

Any change to a solid envelope, support/constraint chain, axis/path, range, neighboring clearance, payload envelope, fastener envelope, cable path, retention/end-stop, manual/external constraint assumption or assembly/service state invalidates the relevant motion checkpoint.

For simple rigid variables, Level A + Level B provide a strong baseline. For complex/coupled state spaces, add Level C rather than reducing coverage.
