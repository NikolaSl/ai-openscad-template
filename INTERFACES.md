# Interface and Motion Contracts

A part owns its local geometry; this file owns the **contract at boundaries between parts**. Use stable interface IDs so changes can invalidate the correct downstream scope.

## Contract rules

1. Never silently reuse an interface ID for a different meaning.
2. A dimension shared by multiple parts has one owner in `src/config.scad` or a purchased-hardware envelope.
3. Downstream parts derive from the contract; they do not independently redefine it.
4. Changing a contract invalidates all dependent geometry/QA until revalidated.
5. CAD validation does not imply physical fit validation.

## Interface register

| ID | Side A | Side B | Contract | Parameter owner | CAD status | Physical status |
|---|---|---|---|---|---|---|
| `I-EXAMPLE` | `P-EXAMPLE` | environment | template demonstration only | `EXAMPLE_*` | template-only | N/A |

## Motion contracts

| Motion ID | Moving assembly | Reference/fixed assembly | Range/checkpoints | Collision-sensitive interfaces | Status |
|---|---|---|---|---|---|
| `M-EXAMPLE` | demo arm | demo base | `-45°..90°` | example only | template-only |

## Parameter-to-interface invalidation map

| Parameter family | Interfaces / motion to invalidate |
|---|---|
| `EXAMPLE_*` | `I-EXAMPLE`, `M-EXAMPLE` |

Replace the example with real parameter families before detailed project modeling.

## Backtracking procedure

1. Name the failing interface/motion ID.
2. Identify the nearest owner parameter/part.
3. Revise that owner rather than forcing downstream geometry.
4. Mark affected contracts/parts `NEEDS_REVALIDATION`.
5. Run QA outward in dependency order.
6. Update parts, assembly/BOM and project state.
