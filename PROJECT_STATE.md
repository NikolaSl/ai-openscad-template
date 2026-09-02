# Project State — fresh-session checkpoint

This is the short resume index, not a replacement for source, requirements, parts, interfaces, assembly/BOM or QA evidence.

## Current phase

**Template bootstrap / planning.** Replace this with the real project phase.

## Current trusted assembly

```text
src/assemblies/example_mechanism.scad
```

Replace with the best-known current partial/full machine.

## Completed subsystems

- Template browser/QA infrastructure only.

## Current trusted QA checkpoints

- None for the real machine yet.

## HOLD / VERIFY

- `HOLD-PROJECT-REQUIREMENTS` — fill `REQUIREMENTS.md`.
- `HOLD-PART-DECOMPOSITION` — replace the example rows in `PARTS.md`.
- `HOLD-INTERFACE-ARCHITECTURE` — define real interface contracts before detailed geometry.

## Next recommended sequence

```text
requirements
→ complete part decomposition
→ interface/motion contracts
→ shared parameter architecture
→ dependency order
→ first elementary part
→ full visual/geometric QA
→ integrate
→ update assembly/BOM/state
```

## Continuity invariant

If a decision made in chat would be needed after restarting the conversation, commit it before considering the engineering step complete.
