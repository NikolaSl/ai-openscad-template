# AI OpenSCAD Parametric CAD Template

Reusable repository template for **AI-assisted parametric mechanical CAD** projects that must remain reproducible, inspectable and usable from a normal phone/tablet browser.

This template extracts the project-independent workflow and tooling proven while developing `alt-az-3d-mount`:

- repository-first engineering memory;
- whole-machine planning before detailed geometry;
- complete part decomposition and interface contracts;
- one shared parameter system;
- dependency-ordered incremental part generation;
- visual/geometric QA for every elementary part;
- context and assembly QA after every accepted part;
- full-range motion QA for mechanisms;
- dense mesh collision/minimum-clearance sweeps for rigid DOFs;
- controlled recursive backtracking and invalidation;
- live BOM and assembly guide;
- physical calibration/fit feedback;
- durable engineering decision logging;
- human review checkpoints;
- mobile browser OpenSCAD WebAssembly rendering in a background Web Worker;
- dependency-aware source mounting so unrelated files do not slow each render;
- optional browser `-D` overrides for inspecting parameter/motion poses from a phone.

The repository, not the chat history, is the persistent source of engineering context.

The reusable environment is self-tested; see `docs/template-validation.md`.

## One-time GitHub setup

GitHub repository settings are intentionally outside the template files themselves.

1. **Template source repository:** `Settings → General → Template repository` — enable this on `ai-openscad-template` so future projects can be created with **Use this template**.
2. **Each concrete project:** `Settings → Pages → Build and deployment → Source → GitHub Actions` — enable Pages so `.github/workflows/pages.yml` can publish the browser validator.

The workflow builds the complete Pages artifact itself, but a normal workflow `GITHUB_TOKEN` is not assumed to have repository-administration permission to create/enable the Pages site.

## New-project bootstrap

After creating a repository from this template:

1. Fill `REQUIREMENTS.md` before detailed modeling.
2. Decompose the complete intended machine in `PARTS.md` without designing every part yet.
3. Define neighboring contracts and motion contracts in `INTERFACES.md`.
4. Replace the example values in `src/config.scad` with the shared parameter architecture.
5. Establish dependency/build order in `PARTS.md`.
6. Stop for a human review of the plan/interface/parameter architecture.
7. Model one elementary part at a time under `src/parts/`.
8. Run the full visual/geometric/context QA loop before treating a part as a trusted dependency.
9. Integrate each accepted part into the current partial/full assembly under `src/assemblies/`.
10. Run `MOTION_QA_PROTOCOL.md` wherever moving geometry exists.
11. Keep `ASSEMBLY.md`, BOM, `DECISIONS.md`, `PROJECT_STATE.md`, HOLD/VERIFY items and browser review synchronized with every accepted design step.

A fresh AI/agent session should read:

1. `AGENTS.md`
2. `REPOSITORY_CONTRACT.md`
3. `DESIGN_PROTOCOL.md`
4. `VISUAL_QA_PROTOCOL.md`
5. `MOTION_QA_PROTOCOL.md`
6. `BROWSER_REVIEW_PROTOCOL.md`
7. `PROJECT_STATE.md`
8. `REQUIREMENTS.md`
9. `DECISIONS.md`
10. `PARTS.md`
11. `INTERFACES.md`
12. `ASSEMBLY.md`
13. `CALIBRATION.md`
14. `src/config.scad`
15. relevant QA plans/results and current assembly/neighbor sources.

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

Generated QA artifacts belong under `build/` and are normally ignored. CAD source, parameters, interface contracts, procedures and accepted engineering decisions remain version controlled.

## Browser review

GitHub Pages is built by `.github/workflows/pages.yml`. The deployment pins a modern OpenSCAD WebAssembly build and Three.js. The browser manifest is generated from the exact commit and contains SHA-256 hashes plus recursive dependency closures for renderable SCAD entry points.

The template contains a minimal example part/mechanism and collision fixtures so the environment can prove itself immediately. Replace/remove them when the real project decomposition and parameter architecture are ready. The Pages workflow itself is template-safe and does not require the example filenames to remain.

## QA layers

### Visual/geometric part QA

```bash
python3 -m pip install -r requirements-qa.txt
python3 tools/visual_qa.py src/parts/example_part.scad
```

Produces full mesh checks, seven standard views, center X/Y/Z sections, contact sheet and `qa.json`. Add project-specific critical/offset sections when needed; the standard set is only the minimum.

### Generic motion compile/assertion sweep

```bash
python3 tools/motion_sweep.py --plan qa/motion-plan.json
```

Drives OpenSCAD motion parameters across configured ranges, coupled samples and human-review poses.

### Dense mesh collision/distance sweep

```bash
python3 -m pip install -r requirements-motion-qa.txt
python3 tools/mesh_motion_qa.py --plan qa/mesh-motion-plan.json
```

Exports moving/fixed collision bodies once and uses `trimesh` + `python-fcl` for dense collision and minimum-distance checks across a rigid rotational or translational DOF. Complex multi-axis/linkage mechanisms can add project-specific transform/collision adapters while keeping the same protocol.

### End-to-end template self-test

`.github/workflows/template-self-test.yml` verifies the demonstration visual QA, OpenSCAD motion sweep and FCL collision sweep. It automatically skips its demo tests once a derived project removes/replaces the template demonstration files.

For full local QA install OpenSCAD and Xvfb (`xvfb-run`) in addition to Python 3.

## Validation status

The reusable template demonstration has passed:

```text
visual/geometric QA                  PASS
OpenSCAD parameter/compile sweep     PASS
rigid mesh collision/distance sweep  PASS
GitHub Pages build/deploy            PASS
```

See `docs/template-validation.md` for the accepted checkpoint and limitations.

## Template policy

Do not accumulate project-specific mechanisms in this template. Improvements that are reusable across unrelated parametric mechanical projects belong here; concrete machine geometry belongs in repositories created from the template.

If browser rendering becomes too slow on target mobile devices, measure first. CI-prebuilt mesh previews are an allowed exception, not the default architecture.
