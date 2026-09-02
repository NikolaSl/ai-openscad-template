# Physical Calibration and Measurement Worksheet

Record **raw measurements first**, then change shared CAD parameters through the interface/invalidation procedure.

## Printer/material/profile

- Printer: TBD
- Material: TBD
- Nozzle: TBD
- Layer height: TBD
- Slicer/profile: TBD
- Date: TBD

## Purchased hardware measurements

| Hardware ID | Dimension | Nominal | Measured | Instrument | Notes |
|---|---|---:|---:|---|---|
| `H-...` | TBD | TBD | TBD | caliper/micrometer | |

## Fit coupon results

| Interface | Nominal CAD | Coupon variants | Selected value | Fit classification | Notes |
|---|---:|---|---:|---|---|
| shaft/bore | TBD | TBD | TBD | sliding/close/press | |
| bearing seat | TBD | TBD | TBD | slip/press | |
| screw clearance | TBD | TBD | TBD | free/close | |
| nut/insert pocket | TBD | TBD | TBD | retained/free | |

## Physical prototype results

| Test ID | Parts/interfaces | Expected | Observed | Pass? | Required change |
|---|---|---|---|---|---|
| `T-...` | TBD | TBD | TBD | TBD | TBD |

## Propagation procedure

After selecting a measured fit/value:

1. update the owning parameter in `src/config.scad`;
2. identify affected interface IDs in `INTERFACES.md`;
3. mark dependent parts `NEEDS_REVALIDATION` in `PARTS.md`;
4. regenerate/re-QA in dependency order;
5. repeat affected motion QA;
6. update `ASSEMBLY.md`, BOM and `PROJECT_STATE.md`.

Never hide a real measured correction as a one-off magic number inside a downstream part.
