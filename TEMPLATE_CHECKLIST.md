# New Project Checklist

Use this immediately after creating a repository from the template.

## Project identity

- [ ] Replace README introduction with concrete machine purpose.
- [ ] Record licensing choice for the derived hardware/software.
- [ ] Enable GitHub Pages with GitHub Actions if not already enabled.
- [ ] Confirm the browser validator deploys and renders the example model.

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
- [ ] Replace `qa/motion-plan.json` with the real motion plan, or explicitly mark motion QA not applicable.

## First accepted part

- [ ] Full geometric QA.
- [ ] ISO + six orthographic views.
- [ ] X/Y/Z center sections plus critical offset sections.
- [ ] Neighbor/context QA.
- [ ] Integrate into current assembly.
- [ ] Update `PARTS.md`, `INTERFACES.md`, `ASSEMBLY.md`, BOM and `PROJECT_STATE.md`.
- [ ] Verify browser rendering from phone/tablet.

## Before production printing

- [ ] Real hardware dimensions measured.
- [ ] Printer/material fit coupons completed where needed.
- [ ] Physical results recorded in `CALIBRATION.md`.
- [ ] Affected shared parameters updated through invalidation procedure.
- [ ] Affected part/assembly/motion QA repeated.
- [ ] BOM/fastener lengths frozen only after dry-fit.
