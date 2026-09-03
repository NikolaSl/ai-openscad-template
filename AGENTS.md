# Instructions for AI / automated engineering agents

This repository is designed to be usable from a completely fresh chat or agent session. **Do not rely on conversation history as project memory.** Reconstruct current state from the repository before changing geometry.

## Mandatory bootstrap

Read in this order before engineering work:

1. `REPOSITORY_CONTRACT.md`
2. `DESIGN_PROTOCOL.md`
3. `MECHANICAL_INTEGRITY_PROTOCOL.md`
4. `VISUAL_QA_PROTOCOL.md`
5. `MOTION_QA_PROTOCOL.md`
6. `BROWSER_REVIEW_PROTOCOL.md`
7. `PROJECT_STATE.md`
8. `REQUIREMENTS.md`
9. `DECISIONS.md`
10. `PARTS.md`
11. `INTERFACES.md`
12. `ASSEMBLY.md`
13. `CALIBRATION.md`
14. `src/config.scad`
15. relevant QA plans/results and the current assembly/neighbor sources.

## Engineering behavior

- Preserve the global machine plan while solving one elementary part at a time.
- Do not begin detailed geometry before requirements, decomposition, interfaces, constraint/DOF architecture and shared parameters are sufficiently defined.
- Use stable part/interface/motion/constraint IDs in reasoning and commit messages where practical.
- Treat already accepted interfaces and constraint chains as contracts. If one must change, explicitly invalidate affected downstream geometry and re-run QA in dependency order.
- Never force a downstream part around a bad upstream decision when controlled backtracking is cleaner.
- Unknown physical dimensions are `HOLD-*` / `VERIFY-*` items, not invitations to invent precision.
- Do not mark a part DONE merely because OpenSCAD compiles.
- A CAD transform is not a physical mechanism: every intended trajectory must be enforced by bearings, shafts, guides, slots, hinges, rails, linkages, flexures or equivalent real constraints.
- Every installed rigid body must have its unintended degrees of freedom physically constrained and an understandable load/reaction path.
- Default solid-body rule: if an explicit interface does not permit contact/fit/embedding/passage, physical solids must not intersect.

## Part acceptance transaction

For every new or materially changed elementary part, complete all applicable items before treating it as a trusted dependency:

```text
source + shared parameters
→ individual geometric/visual QA
→ sections through critical internal geometry
→ neighboring/context QA
→ physical solid-pair relationship checks
→ support / constraint / load-path review
→ current assembly integration
→ motion + adjustment state-space QA if affected
→ PARTS / INTERFACES / constraint register update
→ ASSEMBLY + live BOM update
→ DECISIONS / PROJECT_STATE / HOLD update
→ browser reviewability
```

## QA rules

- Printable elementary parts: full mesh QA plus ISO, top, bottom, front, back, left, right and X/Y/Z center sections; add critical offset/detail sections when needed.
- Assemblies: inspect all touched interfaces, fastener envelopes, support paths, assembly/tool-access sequence and forbidden solid-pair relations.
- Do not hide internal collisions by unioning all bodies in one moving collision mesh. Bodies that share the same operational transform can still collide internally.
- Moving/adjustable mechanisms: follow `MOTION_QA_PROTOCOL.md` across operational DOFs, adjustment DOFs and relevant discrete/service states, including endpoints and coupled states.
- For every intended DOF, verify which physical constraints remove the other rigid-body DOFs; underconstraint and impossible overconstraint are both failures.
- Physical fit, stiffness, torque, backlash, preload and material behavior remain physical gates even after CAD QA passes.

## Repository continuity

If a design decision made during a conversation would be needed in a future fresh session, commit it to the appropriate source-of-truth file before considering the step complete.

`DECISIONS.md` records durable engineering choices and rejected alternatives whose rationale matters later. `PROJECT_STATE.md` remains the concise current checkpoint.

## Mobile/browser invariant

Every useful part and subsystem/full assembly must remain reviewable from the GitHub Pages browser surface. Browser OpenSCAD runs in a Web Worker with dependency-closure source loading; heavy CAD must never block the UI thread.

## Human review

Stop for explicit human inspection at major subsystem gates, before expensive prints, after major backtracking and before changing a validated high-fanout interface/constraint. Present a compact state: what changed, what QA passed, what remains provisional and the proposed next step.
