# Assembly Guide and Live BOM

This file is a **live build product**. It must always describe how to physically build the best-known machine at the current checkpoint.

## Printable/fabricated parts

| Qty | ID | File / fabrication | Role | Status |
|---:|---|---|---|---|
| 1 | `P-EXAMPLE` | `src/parts/example_part.scad` | template demo only | replace |

## Purchased mechanical components

| Qty | ID | Component | Specification | Frozen? |
|---:|---|---|---|---|
| 0 | `H-EXAMPLE` | replace | — | no |

## Fasteners/hardware

| Qty | Fastener | Where used | Status |
|---:|---|---|---|
| 0 | replace | — | — |

## Raw stock / fabrication

| Qty | Material | Operation | Final dimension/status |
|---:|---|---|---|
| 0 | replace | — | — |

## Electronics

Add only when part of project scope.

## Consumables and tools

List special tools, grease, adhesive, threadlocker, inserts, taps, reamers, etc. when needed.

## Calibration/fit tests before production build

- Fill `CALIBRATION.md` for printer/material/hardware interfaces that are not safely nominal.
- Print small coupons before expensive assemblies when possible.

## Assembly sequence

Replace with exact incremental steps. Every step should state orientation, mating IDs, fasteners, insertion/tool direction, tightening/preload, lubrication/adhesive and a post-step verification.

### A0. Template example

1. Render `src/assemblies/example_mechanism.scad` only to confirm the environment.
2. Do not treat the example geometry as part of the real product.

## Mechanical tests before powered/loaded use

- [ ] All intended DOFs move through full physical range without collision/binding.
- [ ] Bearings/shafts/fits are correct.
- [ ] Fasteners remain accessible and retained.
- [ ] Payload/load is balanced/supported as required.
- [ ] Cables/hoses remain outside swept volumes.
- [ ] Guards/stops behave as designed.

## Live-BOM invariant

After every accepted geometry/interface change, update quantities and remove obsolete hardware immediately. Do not postpone BOM cleanup until the end.
