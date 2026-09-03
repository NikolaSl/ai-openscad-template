# New Project Checklist

Use this immediately after creating a repository from the template.

## Template-source repository setup

For `ai-openscad-template` itself:

- [ ] GitHub `Settings → General → Template repository` is enabled so new repositories can use **Use this template**.
- [ ] GitHub `Settings → Pages → Build and deployment → Source → GitHub Actions` is enabled if the template's own browser demo should be published.

These are repository-administration settings and are not assumed to be writable by the normal Actions token.

## Project identity

For every repository created from the template:

- [ ] Replace README introduction with concrete machine purpose.
- [ ] Record licensing choice for the derived hardware/software.
- [ ] Enable `Settings → Pages → Build and deployment → Source → GitHub Actions`.
- [ ] Confirm the browser validator deploys and renders the example model or first real model.

## Planning before geometry

- [ ] Fill `REQUIREMENTS.md` including load cases, operational motion and adjustment ranges.
- [ ] Create the complete initial elementary-part list in `PARTS.md`.
- [ ] Assign stable part IDs.
- [ ] Define all known neighboring interfaces in `INTERFACES.md`.
- [ ] Classify relevant physical solid-body relationships (`FORBIDDEN_OVERLAP`, `CLEARANCE`, intended contacts/fits/passages, etc.).
- [ ] Define every operational and adjustment DOF/state before detailed moving geometry.
- [ ] Create the constraint/DOF register: explain which real bearings/shafts/guides/slots/hinges/rails/fasteners remove unwanted rigid-body DOFs.
- [ ] Define retention/end stops and anti-rotation/anti-translation features.
- [ ] Record major load/reaction paths and support spacing.
- [ ] Establish shared parameter families/datums in `src/config.scad`.
- [ ] Establish dependency/build order.
- [ ] Mark unknown real-hardware dimensions as HOLD/VERIFY rather than inventing precision.

## Replace template demo

- [ ] Replace/remove `src/parts/example_part.scad` when the first real part exists.
- [ ] Replace/remove `src/assemblies/example_mechanism.scad` when the first real assembly exists.
- [ ] Replace/remove the example collision bodies under `src/qa/` when real motion QA geometry exists.
- [ ] Replace `qa/motion-plan.json` with the real compile/assertion motion plan, or explicitly mark it not applicable.
- [ ] Replace `qa/mesh-motion-plan.json` with real solid-pair/motion collision plans where applicable, or document why project-specific Level C collision tooling is required.
- [ ] Update default workflow-dispatch input paths if the example filenames are removed.

## First accepted part

- [ ] Full geometric QA.
- [ ] ISO + six orthographic views.
- [ ] X/Y/Z center sections plus critical offset sections where required.
- [ ] Neighbor/context QA with realistic hardware envelopes where relevant.
- [ ] Classify/check every newly relevant solid-body pair.
- [ ] Verify support, retention, intended DOFs and load path.
- [ ] Verify fastener head/nut/washer envelopes, insertion direction and tool access.
- [ ] Integrate into current assembly.
- [ ] Update `PARTS.md`, `INTERFACES.md`, constraint register, `ASSEMBLY.md`, BOM and `PROJECT_STATE.md`.
- [ ] Verify browser rendering from phone/tablet.

## Moving / adjustable mechanism gate

- [ ] Motion/adjustment contract exists in `INTERFACES.md`.
- [ ] Physical constraint ID/chain exists for every intended DOF.
- [ ] Both endpoints of every continuous state variable are explicitly checked.
- [ ] `tools/motion_sweep.py` covers complete configured ranges and representative/coupled poses.
- [ ] `tools/mesh_motion_qa.py` is used for rigid-body collision/minimum-distance QA where applicable.
- [ ] Internal same-transform solid pairs are checked rather than hidden inside a union mesh.
- [ ] Operational × adjustment coupled states are covered where geometry can interact.
- [ ] Complex/coupled mechanisms have a project-specific Level C adapter or documented conservative proof strategy where the generic tool is insufficient.
- [ ] Constraint coherence (bearing/guide capture, axial retention, end stops) remains valid throughout the state space.
- [ ] Any motion/state-envelope or support-chain geometry change invalidates and repeats the complete affected sweep.

## Before production printing

- [ ] Real hardware dimensions measured.
- [ ] Printer/material fit coupons completed where needed.
- [ ] Physical results recorded in `CALIBRATION.md`.
- [ ] Affected shared parameters updated through invalidation procedure.
- [ ] Affected part/assembly/solid-pair/motion QA repeated.
- [ ] Physical support/load path and retention verified under realistic load where CAD cannot prove stiffness/strength.
- [ ] BOM/fastener lengths frozen only after dry-fit.
