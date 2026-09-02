# Engineering Decision Log

Use this file for durable design/process choices whose **rationale will matter to a future session**. Do not use it for every small edit; normal implementation history belongs in Git commits.

The current machine state belongs in `PROJECT_STATE.md`; formal boundary contracts belong in `INTERFACES.md`; numerical shared values belong in `src/config.scad`.

## Decision format

```markdown
## D-YYYY-NNN — Short title

Status: accepted | superseded | provisional
Date: YYYY-MM-DD
Affected IDs: P-..., I-..., M-... (if applicable)

### Context
What problem/constraint required a decision?

### Decision
What was chosen?

### Why
Why is this preferable to the credible alternatives?

### Consequences
What downstream geometry, QA, BOM, physical testing or limitations follow?

### Revisit when
Which new measurement/requirement/failure would justify reopening it?
```

When a decision is superseded, keep the old entry and link/name the replacement so reasoning is not lost.

---

## Template decisions

### D-TEMPLATE-001 — Repository is persistent engineering memory

Status: accepted

The repository, not chat history, is the source of persistent project context. Any decision required to resume engineering in a fresh session must be committed to source, state, interface, assembly/BOM, calibration or this decision log.

### D-TEMPLATE-002 — Browser-rendered OpenSCAD is the default mobile review path

Status: accepted

The normal browser path is exact deployed SCAD source → recursive dependency closure → pinned OpenSCAD WebAssembly/Manifold in a background Web Worker → binary STL → Three.js. CI-prebuilt STL previews are an exception only after measured target-device performance becomes unacceptable.

### D-TEMPLATE-003 — Moving mechanisms require full-range QA

Status: accepted

Named poses are not sufficient. Every intended degree of freedom requires both endpoints, a justified full-range sweep, relevant coupled states and collision/clearance validation at a proof level appropriate to the mechanism.

These template entries may remain in derived projects because they define the inherited engineering process. Add project-specific decisions below them.
