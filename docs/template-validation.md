# Template Validation Checkpoint

This document records the accepted validation state of the reusable `ai-openscad-template` environment. It validates the **template infrastructure and demonstration fixtures**, not any future machine created from the template.

## Status

**PASS — reusable methodology, CI QA backbone and GitHub Pages mobile review environment are operational.**

## GitHub Pages / browser publication

GitHub Pages is enabled and the browser validator has completed successful build + deploy runs.

Published review surface:

```text
https://nikolasl.github.io/ai-openscad-template/
```

The Pages build validates and publishes:

- exact checked-out `src/` snapshot;
- SHA-256 manifest for SCAD sources;
- recursive `include`/`use` dependency closure for every renderable entry;
- pinned OpenSCAD WebAssembly runtime;
- Manifold browser rendering in a background Web Worker;
- Three.js interactive STL viewing;
- responsive phase/elapsed-time/Cancel controls;
- optional bounded `-D` review overrides;
- direct links to persistent project/methodology documents.

The browser path is source-derived and does not rely on CI-prebuilt STL previews.

## Real browser WebAssembly smoke test

The Pages build now starts the generated site under a local HTTP server and opens it with real headless Chrome through `puppeteer-core` **before deployment**. `tools/browser_smoke_test.mjs` exercises the actual UI + Web Worker + downloaded OpenSCAD WASM path rather than only syntax-checking JavaScript.

Accepted smoke result:

```text
Browser WASM render PASS:
parts/example_part.scad
80.0 × 60.0 × 6.0 mm
1,968 triangles
browser WASM

Browser -D override PASS:
assemblies/example_mechanism.scad
DEMO_ANGLE=45
rendered from exact deployed source
```

Therefore a Pages deployment is blocked if the browser cannot initialize the worker/runtime, verify/mount the source closure, compile an actual model, parse/display the generated STL, or pass the demonstration `-D` parameter override through to OpenSCAD.

For derived projects that remove the demonstration assembly, the smoke test still chooses a normal `parts/` entry (or the first available renderable entry) for a real WASM render. The demo-specific `-D` check is conditional.

## Template environment self-test

The template demonstration self-test completed successfully after dependency/tooling fixes.

Validated steps:

1. install OpenSCAD + Xvfb;
2. install Python visual/mesh QA dependencies;
3. initialize `python-fcl` collision runtime;
4. run full geometric/visual QA of `src/parts/example_part.scad`;
5. run configured OpenSCAD parameter/compile motion sweep;
6. run dense rigid-mesh collision/minimum-distance sweep;
7. preserve generated QA evidence as a workflow artifact.

### Visual/geometric demonstration result

For the example part:

```text
Simple: yes
watertight: true
is_volume: true
connected components: 1
bounds: 80 × 60 × 6 mm
views: ISO, top, bottom, front, back, right, left
sections: X, Y, Z
```

The QA tooling also produces `qa.json` and a contact sheet.

### Generic motion sweep demonstration

```text
result: PASS
compile/assertion samples: 10
human-review renders: 4
failures: 0
```

### Dense mesh collision/distance demonstration

```text
result: PASS
fixed-obstruction checks: 1
failures: 0
```

This confirms that both the lightweight OpenSCAD pose/assertion layer and the reusable `trimesh` + `python-fcl` rigid-body collision layer are executable in CI.

## Mobile parametric review

The browser review environment supports optional bounded OpenSCAD `-D NAME=value` overrides. This lets a phone/tablet regenerate alternate parameter values or mechanism poses without editing repository source.

The selected model and review-only override string can be preserved in the URL for bookmarking/sharing. These overrides are **derived review state only**; accepted engineering values must still be committed through shared parameters/interfaces and the normal invalidation/QA process.

## What this checkpoint proves

A repository created from this template starts with working infrastructure for:

- repository-first continuity across fresh chats;
- requirements/decomposition/interface/state documents;
- shared OpenSCAD parameter architecture;
- per-part visual/geometric QA;
- current-assembly integration discipline;
- full-range motion QA planning;
- generic pose/assertion sweeps;
- generic dense rigid-body collision/distance sweeps;
- project-specific Level-C motion adapters when needed;
- live assembly/BOM/calibration records;
- durable decision logging;
- mobile browser rendering from exact source;
- CI smoke testing of the real browser WebAssembly render path.

## What this checkpoint does not prove

It does not prove the correctness of a future machine design. Every derived project must still define its own requirements, part/interface graph, numerical parameters, motion contracts, physical calibration, collision models, assembly sequence and acceptance evidence.

It also does not make browser `-D` experiments persistent engineering decisions automatically.

## Template administration

For future repositories to be created through GitHub's **Use this template** UI, the source repository must have `Settings → General → Template repository` enabled. This is a repository-administration setting rather than a file in the template.

For each new derived repository, enable `Settings → Pages → Build and deployment → Source → GitHub Actions` before expecting the browser review page to deploy.
