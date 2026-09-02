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
- controlled recursive backtracking and invalidation;
- live BOM and assembly guide;
- physical calibration/fit feedback;
- human review checkpoints;
- mobile browser OpenSCAD WebAssembly rendering in a background Web Worker;
- dependency-aware source mounting so unrelated files do not slow each render.

The repository, not the chat history, is the persistent source of engineering context.

## New-project bootstrap

After creating a repository from this template:

1. Fill `REQUIREMENTS.md` before detailed modeling.
2. Decompose the complete intended machine in `PARTS.md` without designing every part yet.
3. Define neighboring contracts and motion contracts in `INTERFACES.md`.
4. Replace the example values in `src/config.scad` with the shared parameter architecture.
5. Establish dependency/build order in `PARTS.md`.
6. Model one elementary part at a time under `src/parts/`.
7. Run the full visual/geometric QA loop before treating a part as a trusted dependency.
8. Integrate each accepted part into the current partial/full assembly under `src/assemblies/`.
9. Run `MOTION_QA_PROTOCOL.md` wherever moving geometry exists.
10. Keep `ASSEMBLY.md`, BOM, `PROJECT_STATE.md`, HOLD/VERIFY items and browser review synchronized with every accepted design step.

Read these process documents first in a fresh AI/human session:

1. `REPOSITORY_CONTRACT.md`
2. `DESIGN_PROTOCOL.md`
3. `VISUAL_QA_PROTOCOL.md`
4. `MOTION_QA_PROTOCOL.md`
5. `BROWSER_REVIEW_PROTOCOL.md`
6. `PROJECT_STATE.md`
7. `REQUIREMENTS.md`
8. `PARTS.md`
9. `INTERFACES.md`
10. `ASSEMBLY.md`
11. `CALIBRATION.md`
12. `src/config.scad`

## Mobile/browser workflow

```text
voice/chat on phone
        ↓
AI reads + modifies GitHub repository
        ↓
GitHub preserves complete engineering state
        ↓
GitHub Pages publishes exact source snapshot
        ↓
phone browser
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

## Repository layout

```text
README.md
REPOSITORY_CONTRACT.md
DESIGN_PROTOCOL.md
VISUAL_QA_PROTOCOL.md
MOTION_QA_PROTOCOL.md
BROWSER_REVIEW_PROTOCOL.md
TEMPLATE_CHECKLIST.md
REQUIREMENTS.md
PROJECT_STATE.md
PARTS.md
INTERFACES.md
ASSEMBLY.md
CALIBRATION.md

src/
  config.scad
  lib/
  parts/
  assemblies/
  envelopes/
  calibration/

tools/
  build_browser_manifest.py
  visual_qa.py
  motion_sweep.py

qa/
  motion-plan.json

site/
  index.html
  app.js
  openscad-worker.js
  style.css

.github/workflows/
  pages.yml
  visual-qa.yml
  motion-qa.yml
```

Generated QA artifacts belong under `build/` and are normally ignored. CAD source, parameters, interface contracts, procedures and accepted engineering decisions remain version controlled.

## Browser review

GitHub Pages is built by `.github/workflows/pages.yml`. The deployment pins a modern OpenSCAD WebAssembly build and Three.js. The browser manifest is generated from the exact commit and contains SHA-256 hashes plus recursive dependency closures for renderable SCAD entry points.

The template contains a minimal example part and mechanism so the environment works immediately. Replace/remove them when the real project decomposition and parameter architecture are ready.

## Local QA prerequisites

For full local visual QA install:

- OpenSCAD;
- Xvfb (`xvfb-run`) on headless Linux;
- Python 3;
- packages from `requirements-qa.txt`.

Example:

```bash
python3 -m pip install -r requirements-qa.txt
python3 tools/visual_qa.py src/parts/example_part.scad
python3 tools/motion_sweep.py --plan qa/motion-plan.json
```

## Template policy

Do not accumulate project-specific mechanisms in this template. Improvements that are reusable across unrelated parametric mechanical projects belong here; concrete machine geometry belongs in repositories created from the template.

If browser rendering becomes too slow on target mobile devices, measure first. CI-prebuilt mesh previews are an allowed exception, not the default architecture.
