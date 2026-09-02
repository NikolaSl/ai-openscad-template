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

- [ ] Fill `REQUIREMENTS.md`.
- [ ] Create the complete initial elementary-part list in `PARTS.md`.
- [ ] Assign stable part IDs.
- [ ] Define all known neighboring interfaces in `INTERFACES.md`.
- [ ] Define each motion DOF and range before detailed moving geometry.
- [ ] Establish shared parameter families/datums in `src/config.scad`.
- [ ] Establish dependency/build order.
- [ ] Mark unknown real-hardware dimensions as HOLD/VERIFY rather than inventing precision.

## Replace template demo

- [ ] Replace/remove `src/parts/example_part.scad` when the first real part exists.
- [ ] Replace/remove `src/assemblies/example_mechanism.scad` when the first real assembly exists.
- [ ] Replace/remove the example collision bodies under `src/qa/` when real motion QA geometry exists.
- [ ] Replace `qa/motion-plan.json` with the real compile/assertion motion plan, or explicitly mark it not applicable.
- [ ] Replace `qa/mesh-motion-plan.json` with the real rigid-body collision plan when applicable, or document why project-specific collision tooling is required.
- [ ] Update default workflow-dispatch input paths if the example filenames are removed.

## First accepted part

- [ ] Full geometric QA.
- [ ] ISO + six orthographic views.
- [ ] X/Y/Z center sections plus critical offset sections where required.
- [ ] Neighbor/context QA.
- [ ] Integrate into current assembly.
- [ ] Update `PARTS.md`, `INTERFACES.md`, `ASSEMBLY.md`, BOM and `PROJECT_STATE.md`.
- [ ] Verify browser rendering from phone/tablet.

## Moving mechanism gate

- [ ] Motion contract exists in `INTERFACES.md`.
- [ ] Both endpoints are explicitly checked.
- [ ] `tools/motion_sweep.py` covers the full configured range and representative/coupled poses.
- [ ] `tools/mesh_motion_qa.py` is used for rigid-body collision/minimum-distance QA where applicable.
- [ ] Complex/coupled mechanisms have a project-specific Level C adapter or documented proof strategy where the generic tool is insufficient.
- [ ] Any motion-envelope geometry change invalidates and repeats the complete affected sweep.

## Before production printing

- [ ] Real hardware dimensions measured.
- [ ] Printer/material fit coupons completed where needed.
- [ ] Physical results recorded in `CALIBRATION.md`.
- [ ] Affected shared parameters updated through invalidation procedure.
- [ ] Affected part/assembly/motion QA repeated.
- [ ] BOM/fastener lengths frozen only after dry-fit.
