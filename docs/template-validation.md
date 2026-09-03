# Template Validation Checkpoint

This document records the accepted validation state of the reusable `ai-openscad-template` environment. It validates the **template infrastructure and demonstration fixtures**, not any future machine created from the template.

## Status

**PASS — reusable methodology, CI QA backbone and GitHub Pages mobile review environment are operational.**

The methodology now explicitly includes `MECHANICAL_INTEGRITY_PROTOCOL.md`: relevant physical solid pairs must be classified, forbidden overlap must be excluded throughout allowed state space, and intended CAD trajectories must have real physical support/constraint chains that remove unintended rigid-body degrees of freedom.

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

The Pages build starts the generated site under a local HTTP server and opens it with real headless Chrome through `puppeteer-core` **before deployment**. `tools/browser_smoke_test.mjs` exercises the actual UI + Web Worker + downloaded OpenSCAD WASM path rather than only syntax-checking JavaScript.

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

A Pages deployment is therefore blocked if the browser cannot initialize the worker/runtime, verify/mount the source closure, compile an actual model, parse/display the generated STL, or pass the demonstration `-D` parameter override through to OpenSCAD.

For derived projects that remove the demonstration assembly, the smoke test still chooses a normal `parts/` entry (or first available renderable entry) for a real WASM render. The demo-specific `-D` check is conditional.

## Template environment self-test

The template demonstration self-test completed successfully.

Validated steps:

1. install OpenSCAD + Xvfb;
2. install Python visual/mesh QA dependencies;
3. initialize `python-fcl` collision runtime;
4. run full geometric/visual QA of `src/parts/example_part.scad`;
5. run configured OpenSCAD parameter/compile motion sweep;
6. run dense rigid-mesh collision/minimum-distance sweep;
7. preserve generated QA evidence as a workflow artifact.

### Visual/geometric demonstration result

```text
Simple: yes
watertight: true
is_volume: true
connected components: 1
bounds: 80 × 60 × 6 mm
views: ISO, top, bottom, front, back, right, left
sections: X, Y, Z
```

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

This confirms that both the lightweight OpenSCAD pose/assertion layer and reusable `trimesh` + `python-fcl` rigid-body collision layer are executable in CI.

## Mechanical-integrity architecture

The template now requires a derived project to maintain, as applicable:

```text
interface contracts I-*
solid-body relationship contracts R-*
constraint / DOF contracts K-*
motion / adjustment / configuration contracts M-*
```

The default physical rule is that unclassified solid overlap is forbidden. Intended fits, contacts, fastener passages, embedded hardware and kinematic contacts are explicit exceptions rather than bodies silently omitted from collision reasoning.

A free rigid body begins with six rigid-body DOFs. For every real mechanism, the project must document how bearings, shafts, guides, rails, slots, hinges, linkages, locators, fasteners, retention and end stops physically remove unwanted DOFs and leave the intended motion. Support/load paths and underconstraint/overconstraint are part of the engineering review.

The generic tooling provides reusable Level-A/Level-B building blocks. Arbitrary multi-body mechanisms or operational×adjustment Cartesian state spaces can require a project-specific Level-C adapter; the protocol explicitly requires adding that adapter rather than weakening coverage.

## Mobile parametric review

The browser review environment supports optional bounded OpenSCAD `-D NAME=value` overrides. This lets a phone/tablet regenerate alternate parameter values or mechanism poses without editing repository source.

The selected model and review-only override string can be preserved in the URL for bookmarking/sharing. These overrides are **derived review state only**; accepted engineering values must still be committed through shared parameters/interfaces and the normal invalidation/QA process.

## What this checkpoint proves

A repository created from this template starts with working infrastructure for:

- repository-first continuity across fresh chats;
- requirements/decomposition/interface/state documents;
- solid-body relationship and constraint/DOF methodology;
- shared OpenSCAD parameter architecture;
- per-part visual/geometric QA;
- current-assembly integration discipline;
- operational + adjustment full-state QA planning;
- generic pose/assertion sweeps;
- generic dense rigid-body collision/distance sweeps;
- project-specific Level-C state-space adapters when needed;
- live assembly/BOM/calibration records;
- durable decision logging;
- mobile browser rendering from exact source;
- CI smoke testing of the real browser WebAssembly render path.

## What this checkpoint does not prove

It does **not** prove the correctness, structural adequacy or kinematic constraint completeness of a future machine. Every derived project must define and validate its own requirements, body-pair relationships, constraint/DOF chain, load paths, numerical parameters, operational and adjustment ranges, physical calibration, collision models, fasteners, assembly sequence and acceptance evidence.

The demonstration's successful single-DOF collision sweep is proof that the infrastructure runs, not a universal collision proof for mechanisms created later.

Browser `-D` experiments also do not become persistent engineering decisions automatically.

## Template administration

For future repositories to be created through GitHub's **Use this template** UI, the source repository must have `Settings → General → Template repository` enabled. This is a repository-administration setting rather than a file in the template.

For each new derived repository, enable `Settings → Pages → Build and deployment → Source → GitHub Actions` before expecting the browser review page to deploy.
