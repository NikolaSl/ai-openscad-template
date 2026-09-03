# AI OpenSCAD Parametric CAD Template

Reusable repository template for **AI-assisted parametric mechanical CAD** projects that must remain reproducible, inspectable and usable from a normal phone/tablet browser.

This template extracts the project-independent workflow and tooling proven while developing `alt-az-3d-mount`:

- repository-first engineering memory;
- whole-machine planning before detailed geometry;
- complete part decomposition and interface contracts;
- explicit solid-body relationship classification;
- constraint/DOF and support/load-path architecture;
- one shared parameter system;
- dependency-ordered incremental part generation;
- visual/geometric QA for every elementary part;
- pairwise solid collision/clearance QA, including internal same-transform interference;
- context and assembly QA after every accepted part;
- full-range operational + adjustment state-space QA;
- dense mesh collision/minimum-clearance sweeps for rigid DOFs;
- controlled recursive backtracking and invalidation;
- live BOM and assembly guide;
- physical calibration/fit feedback;
- durable engineering decision logging;
- human review checkpoints;
- mobile browser OpenSCAD WebAssembly rendering in a background Web Worker;
- dependency-aware source mounting so unrelated files do not slow each render;
- optional browser `-D` overrides for inspecting parameter/motion poses from a phone.

The repository, not chat history, is the persistent source of engineering context.

The reusable environment is self-tested; see `docs/template-validation.md`.

## Core mechanical invariant

A CAD animation is not automatically a mechanism. A free rigid body has six rigid-body degrees of freedom, so every installed body must have a real physical constraint chain that removes the unintended translations/rotations and leaves only the intended DOF(s).

Likewise, if no explicit interface contract permits a contact/fit/passage/embedded relationship, **two physical solids may not occupy the same volume in any allowed operational, adjustment or relevant configuration state**.

The reusable rules are in `MECHANICAL_INTEGRITY_PROTOCOL.md` and `MOTION_QA_PROTOCOL.md`.

## One-time GitHub setup

GitHub repository settings are intentionally outside the template files themselves.

1. **Template source repository:** `Settings → General → Template repository` — enable this on `ai-openscad-template` so future projects can be created with **Use this template**.
2. **Each concrete project:** `Settings → Pages → Build and deployment → Source → GitHub Actions` — enable Pages so `.github/workflows/pages.yml` can publish the browser validator.

The workflow builds the complete Pages artifact itself, but a normal workflow `GITHUB_TOKEN` is not assumed to have repository-administration permission to create/enable the Pages site.

## New-project bootstrap

After creating a repository from this template:

1. Fill `REQUIREMENTS.md` before detailed modeling, including loads, operational motion and adjustment ranges.
2. Decompose the complete intended machine in `PARTS.md` without designing every part yet.
3. Define neighboring interfaces and solid-body relationship classes in `INTERFACES.md`.
4. Define the constraint/DOF register: bearings, shafts, guides, slots, hinges, rails, locators, retention/end stops and load paths that make the intended mechanisms physically realizable.
5. Replace the example values in `src/config.scad` with the shared parameter architecture.
6. Establish dependency/build order in `PARTS.md`.
7. Stop for a human review of the requirements/interface/constraint/parameter architecture.
8. Model one elementary part at a time under `src/parts/`.
9. Run the full visual/geometric/context/mechanical-integrity QA loop before treating a part as a trusted dependency.
10. Integrate each accepted part into the current partial/full assembly under `src/assemblies/`.
11. Run `MOTION_QA_PROTOCOL.md` for operational and adjustment/configuration state variables wherever geometry can change.
12. Keep `ASSEMBLY.md`, BOM, `DECISIONS.md`, `PROJECT_STATE.md`, HOLD/VERIFY items and browser review synchronized with every accepted design step.

A fresh AI/agent session should read:

1. `AGENTS.md`
2. `REPOSITORY_CONTRACT.md`
3. `DESIGN_PROTOCOL.md`
4. `MECHANICAL_INTEGRITY_PROTOCOL.md`
5. `VISUAL_QA_PROTOCOL.md`
6. `MOTION_QA_PROTOCOL.md`
7. `BROWSER_REVIEW_PROTOCOL.md`
8. `PROJECT_STATE.md`
9. `REQUIREMENTS.md`
10. `DECISIONS.md`
11. `PARTS.md`
12. `INTERFACES.md`
13. `ASSEMBLY.md`
14. `CALIBRATION.md`
15. `src/config.scad`
16. relevant QA plans/results and current assembly/neighbor sources.

## Mobile/browser workflow

```text
voice/chat on phone
        ↓
AI reads + modifies GitHub repository
        ↓
repository preserves complete engineering state
        ↓
GitHub Pages publishes exact source snapshot
        ↓
phone browser
        ↓
select part / subsystem / full assembly
        ↓
optional review-only -D parameter overrides
        ↓
OpenSCAD WebAssembly + Manifold in Web Worker
        ↓
binary STL
        ↓
Three.js interactive review
        ↓
human feedback in chat
```

Heavy CAD execution never runs on the browser UI thread. The page remains responsive, reports phase/elapsed time and provides Cancel. Only the recursive `include`/`use` dependency closure of the selected entry point is mounted into OpenSCAD.

Browser `-D` overrides are useful for reviewing mechanism poses or parameter alternatives, but they are **not persistent engineering decisions**. If a value is accepted, change the owning repository parameter/interface and run the normal invalidation/QA transaction.

## Repository layout

```text
AGENTS.md
README.md
REPOSITORY_CONTRACT.md
DESIGN_PROTOCOL.md
MECHANICAL_INTEGRITY_PROTOCOL.md
VISUAL_QA_PROTOCOL.md
MOTION_QA_PROTOCOL.md
BROWSER_REVIEW_PROTOCOL.md
TEMPLATE_CHECKLIST.md
REQUIREMENTS.md
PROJECT_STATE.md
DECISIONS.md
PARTS.md
INTERFACES.md
ASSEMBLY.md
CALIBRATION.md
requirements-qa.txt
requirements-motion-qa.txt

docs/
  template-validation.md

src/
  config.scad
  lib/
  parts/
  assemblies/
  envelopes/
  calibration/
  qa/

tools/
  build_browser_manifest.py
  visual_qa.py
  motion_sweep.py
  mesh_motion_qa.py

qa/
  motion-plan.json
  mesh-motion-plan.json

site/
  index.html
  app.js
  openscad-worker.js
  style.css

.github/workflows/
  pages.yml
  visual-qa.yml
  motion-qa.yml
  mesh-motion-qa.yml
  template-self-test.yml
```

Generated QA artifacts belong under `build/` and are normally ignored. CAD source, parameters, interface/constraint contracts, procedures and accepted engineering decisions remain version controlled.

## QA layers

### Visual/geometric part QA

```bash
python3 -m pip install -r requirements-qa.txt
python3 tools/visual_qa.py src/parts/example_part.scad
```

Produces full mesh checks, seven standard views, center X/Y/Z sections, contact sheet and `qa.json`. Add project-specific critical/offset sections when needed.

### Mechanical-integrity QA

For every relevant body pair classify whether overlap/contact is forbidden, requires clearance, or is an intentional fit/contact/passage. Include realistic hardware envelopes where they can interfere. Review the constraint/DOF register and support/load path before accepting a moving subassembly.

Bodies that move together are **not** exempt from collision testing; internal same-transform interference is a separate check.

### Generic motion compile/assertion sweep

```bash
python3 tools/motion_sweep.py --plan qa/motion-plan.json
```

Drives OpenSCAD parameters across configured ranges, coupled samples and human-review poses.

### Dense mesh collision/distance sweep

```bash
python3 -m pip install -r requirements-motion-qa.txt
python3 tools/mesh_motion_qa.py --plan qa/mesh-motion-plan.json
```

Exports moving/fixed collision bodies once and uses `trimesh` + `python-fcl` for dense collision and minimum-distance checks across a rigid rotational or translational state variable. The same tool can test an internal body pair by treating one body as the moving body and another as the obstruction. Complex multi-axis, multi-body or operation×adjustment state spaces require project-specific Level C adapters while preserving the same protocol.

### End-to-end template self-test

`.github/workflows/template-self-test.yml` verifies the demonstration visual QA, OpenSCAD motion sweep and FCL collision sweep. It automatically skips its demo tests once a derived project removes/replaces the template demonstration files.

For full local QA install OpenSCAD and Xvfb (`xvfb-run`) in addition to Python 3.

## Validation status

The reusable template demonstration has passed:

```text
visual/geometric QA                  PASS
OpenSCAD parameter/compile sweep     PASS
rigid mesh collision/distance sweep  PASS
real browser WASM render smoke test  PASS
GitHub Pages build/deploy            PASS
```

See `docs/template-validation.md` for the accepted checkpoint and limitations.

## Template policy

Do not accumulate project-specific mechanisms in this template. Improvements that are reusable across unrelated parametric mechanical projects belong here; concrete machine geometry belongs in repositories created from the template.

If browser rendering becomes too slow on target mobile devices, measure first. CI-prebuilt mesh previews are an allowed exception, not the default architecture.
