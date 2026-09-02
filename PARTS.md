# Parts Decomposition and Status Ledger

This file is the source of truth for **what elementary elements make up the machine** and their current engineering state. Create the complete initial plan before detailed geometry.

## Status vocabulary

`PLANNED` · `INTERFACES_DEFINED` · `READY_TO_MODEL` · `MODELED` · `PART_QA_PASS` · `INTEGRATED_CAD` · `ASSEMBLY_QA_PASS` · `TRUSTED_DEPENDENCY` · `PHYSICAL_VERIFY` · `FROZEN` · `BLOCKED` · `NEEDS_BACKTRACK` · `NEEDS_REVALIDATION` · `HUMAN_REVIEW`.

## Printed/fabricated elementary parts

| ID | Qty | Source | Responsibility | Direct dependencies | Status |
|---|---:|---|---|---|---|
| `P-EXAMPLE` | 1 | `src/parts/example_part.scad` | Template demonstration only | `src/config.scad` | `PART_QA_PASS` for template only; replace |

## Purchased/non-printed functional elements

| ID | Qty | Element | Responsibility | Status |
|---|---:|---|---|---|
| `H-EXAMPLE` | 0 | replace with real hardware | — | `PLANNED` |

## Virtual assemblies

| ID | Entry point | Contains | Status |
|---|---|---|---|
| `A-EXAMPLE` | `src/assemblies/example_mechanism.scad` | template demo geometry | template-only |

## Dependency graph

Replace with the real machine graph.

```text
requirements + config
        ↓
   P-EXAMPLE
        ↓
   A-EXAMPLE
```

## Invalidation rule

When a part, purchased-hardware envelope or shared parameter changes:

1. find affected interface IDs in `INTERFACES.md`;
2. mark directly dependent parts `NEEDS_REVALIDATION`;
3. propagate only as far as affected contracts require;
4. repeat QA in dependency order;
5. update `ASSEMBLY.md`, BOM and `PROJECT_STATE.md` before accepting the change.
