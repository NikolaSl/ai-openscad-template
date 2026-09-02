# Instructions for AI / automated engineering agents

This repository is designed to be usable from a completely fresh chat or agent session. **Do not rely on conversation history as project memory.** Reconstruct current state from the repository before changing geometry.

## Mandatory bootstrap

Read in this order before engineering work:

1. `REPOSITORY_CONTRACT.md`
2. `DESIGN_PROTOCOL.md`
3. `VISUAL_QA_PROTOCOL.md`
4. `MOTION_QA_PROTOCOL.md`
5. `BROWSER_REVIEW_PROTOCOL.md`
6. `PROJECT_STATE.md`
7. `REQUIREMENTS.md`
8. `DECISIONS.md`
9. `PARTS.md`
10. `INTERFACES.md`
11. `ASSEMBLY.md`
12. `CALIBRATION.md`
13. `src/config.scad`
14. relevant QA plans/results and the current assembly/neighbor sources.

## Engineering behavior

- Preserve the global machine plan while solving one elementary part at a time.
- Do not begin detailed geometry before requirements, decomposition, interfaces and shared parameters are sufficiently defined.
- Use stable part/interface/motion IDs in reasoning and commit messages where practical.
- Treat already accepted interfaces as contracts. If one must change, explicitly invalidate affected downstream geometry and re-run QA in dependency order.
- Never force a downstream part around a bad upstream decision when controlled backtracking is cleaner.
- Unknown physical dimensions are `HOLD-*` / `VERIFY-*` items, not invitations to invent precision.
- Do not mark a part DONE merely because OpenSCAD compiles.

## Part acceptance transaction

For every new or materially changed elementary part, complete all applicable items before treating it as a trusted dependency:

```text
source + shared parameters
→ individual geometric/visual QA
→ sections through critical internal geometry
→ neighboring/context QA
→ current assembly integration
→ motion QA if the motion envelope changed
→ PARTS / INTERFACES update
→ ASSEMBLY + live BOM update
→ DECISIONS / PROJECT_STATE / HOLD update
→ browser reviewability
```

## QA rules

- Printable elementary parts: full mesh QA plus ISO, top, bottom, front, back, left, right and X/Y/Z center sections; add critical offset/detail sections when needed.
- Assemblies: inspect all touched interfaces and assembly/tool-access sequence.
- Moving mechanisms: never accept from named screenshots alone. Follow `MOTION_QA_PROTOCOL.md`, including endpoints, a complete justified sweep and coupled configurations where relevant.
- Physical fit, stiffness, torque, backlash and material behavior remain physical gates even after CAD QA passes.

## Repository continuity

If a design decision made during a conversation would be needed in a future fresh session, commit it to the appropriate source-of-truth file before considering the step complete.

`DECISIONS.md` records durable engineering choices and rejected alternatives whose rationale matters later. `PROJECT_STATE.md` remains the concise current checkpoint.

## Mobile/browser invariant

Every useful part and subsystem/full assembly must remain reviewable from the GitHub Pages browser surface. Browser OpenSCAD runs in a Web Worker with dependency-closure source loading; heavy CAD must never block the UI thread.

## Human review

Stop for explicit human inspection at major subsystem gates, before expensive prints, after major backtracking and before changing a validated high-fanout interface. Present a compact state: what changed, what QA passed, what remains provisional and the proposed next step.
