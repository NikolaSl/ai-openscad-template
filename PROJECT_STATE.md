# Project State — fresh-session checkpoint

This is the short resume index for the **template repository itself**. A concrete project created from the template should replace the demonstration state below with its real machine checkpoint.

## Current phase

**Reusable parametric-CAD template infrastructure validated and ready for derived projects.**

The template contains repository-first continuity, browser/mobile review, visual/geometric QA, solid-body relationship and constraint/DOF methodology, generic motion sweep tooling, dense rigid-body collision/distance QA, live assembly/BOM/calibration scaffolding and fresh-session agent instructions.

Accepted infrastructure validation is recorded in:

```text
docs/template-validation.md
```

## Template demonstration fixtures

These exist only so a fresh copy can prove that its environment works before real project geometry replaces them:

```text
src/parts/example_part.scad
src/assemblies/example_mechanism.scad
src/qa/example_moving.scad
src/qa/example_fixed.scad
qa/motion-plan.json
qa/mesh-motion-plan.json
```

They are **not** a planned real machine.

## Current trusted infrastructure checkpoints

- GitHub Pages browser validator: **PASS / deployed**.
- Exact source snapshot + SHA-256 manifest: **PASS**.
- Recursive SCAD dependency-closure loading: **PASS**.
- Background OpenSCAD WebAssembly + Manifold rendering: integrated and published.
- Real headless-Chrome browser WASM smoke render + `-D` override path: **PASS**.
- Mobile review-only `-D NAME=value` parameter/motion overrides: integrated; accepted values still require repository commits.
- Visual/geometric demonstration QA: **PASS**.
- Example part: `Simple: yes`, watertight volume, one component, `80 × 60 × 6 mm`, seven standard views + X/Y/Z sections.
- Generic OpenSCAD motion compile/assertion sweep: **PASS**, 10 compile samples + 4 representative renders, zero failures.
- Dense `trimesh` + `python-fcl` rigid-motion collision/distance demonstration: **PASS**, zero failures.
- Mechanical-integrity protocol now requires explicit solid-body relations, constraint/DOF chains, retention and load paths for derived projects.
- End-to-end template self-test workflow: **PASS** for the demonstration fixtures.

## Persistent methodology / bootstrap

A fresh AI session begins with `AGENTS.md`, then follows `REPOSITORY_CONTRACT.md`.

Important persistent files:

```text
AGENTS.md
REPOSITORY_CONTRACT.md
DESIGN_PROTOCOL.md
MECHANICAL_INTEGRITY_PROTOCOL.md
VISUAL_QA_PROTOCOL.md
MOTION_QA_PROTOCOL.md
BROWSER_REVIEW_PROTOCOL.md
PROJECT_STATE.md
REQUIREMENTS.md
DECISIONS.md
PARTS.md
INTERFACES.md
ASSEMBLY.md
CALIBRATION.md
src/config.scad
```

## State for a newly derived project

A new project begins at planning, not at the template's demonstration geometry. Its first engineering sequence is:

```text
requirements + load cases
→ complete elementary part decomposition
→ interface + solid-relationship graph
→ constraint/DOF + support/load-path register
→ operational + adjustment state contracts
→ shared parameter architecture
→ dependency order
→ human planning review gate
→ first elementary part
→ visual/geometric/context/solid-pair/constraint QA
→ assembly integration
→ complete affected state-space motion QA
→ live BOM/state update
→ physical calibration/load verification when required
```

Until requirements/decomposition/interfaces/constraints exist, detailed real-machine geometry should not be generated.

## HOLD / VERIFY placeholders for a derived project

Replace these with project-specific items:

- `HOLD-PROJECT-REQUIREMENTS` — define the actual machine constraints and load cases.
- `HOLD-PART-DECOMPOSITION` — replace template example rows with the complete initial elementary-part plan.
- `HOLD-INTERFACE-ARCHITECTURE` — define real interface and solid-body relationship contracts.
- `HOLD-CONSTRAINT-ARCHITECTURE` — define how each intended motion is physically constrained and retained.
- `HOLD-SHARED-PARAMETERS` — replace `EXAMPLE_*` with real parameter families/datums.
- `VERIFY-PHYSICAL-FITS` — identify real hardware/printer-dependent interfaces requiring measurement/coupons.
- `VERIFY-LOAD-PATHS` — identify support/strength/stiffness assumptions that require analysis or physical load tests.

## Repository administration

GitHub Pages is currently enabled for this repository.

For GitHub's **Use this template** feature, verify that `Settings → General → Template repository` is enabled on the source repository. A file commit cannot substitute for that repository-level setting.

For every new repository created from this template, enable `Settings → Pages → Build and deployment → Source → GitHub Actions` before relying on mobile browser publication.

## Continuity invariant

If a decision made in chat would be needed after restarting the conversation, commit it before considering the engineering step complete. Use `DECISIONS.md` when the rationale itself matters later.
