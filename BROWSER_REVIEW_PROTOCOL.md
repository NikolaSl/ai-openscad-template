# Browser Review Protocol — responsive mobile CAD inspection

The browser is a review surface, not the design source of truth. Source CAD, parameters, interfaces, BOM and QA state remain in the repository.

## 1. Standard render path

```text
exact deployed repository source
        ↓
recursive dependency closure
        ↓
optional review-only OpenSCAD -D overrides
        ↓
OpenSCAD WebAssembly Web Worker
        ↓
binary STL
        ↓
Three.js interactive viewer
```

Use browser rendering by default. A CI-prebuilt preview is an optional exception only if measured target-device performance becomes unacceptable.

## 2. Responsiveness is mandatory

Heavy CAD must never run synchronously on the browser UI thread. The worker may consume CPU for seconds/minutes, but the user must still be able to scroll, inspect source/docs, see elapsed time and cancel without a "page not responding" UI-thread freeze.

## 3. Honest progress

Do not invent percentages for opaque geometry solves. Show:

```text
phase
elapsed time
current detail
real percentage for finite source loading
indeterminate bar during opaque geometry computation
live console output when available
Cancel
```

Typical phases: starting → runtime → source verification → CAD render → output → viewer → done.

## 4. Dependency closure

Adding unrelated CAD files must not make every render slower. At publication time statically resolve recursive `include`/`use` dependencies for each entry point and mount only that closure. If dynamic/external includes cannot be safely resolved, fall back to the full source snapshot for that entry rather than silently omitting files.

## 5. Mobile parameter/motion inspection

The review page may expose optional OpenSCAD `-D NAME=value` overrides so a phone/tablet can inspect alternate parameter values and mechanism poses without editing repository source.

Example:

```text
ALT_ANGLE=45; AZ_ANGLE=120
```

Rules:

- overrides are passed as OpenSCAD arguments directly to the WebAssembly worker, never through a shell;
- variable names are syntactically validated and the number/size of overrides is bounded;
- the selected entry point and override string may be preserved in the page URL so a review pose can be bookmarked/shared;
- the exact repository source and commit remain visible alongside the derived render;
- an override is **review state, not an accepted design change**;
- if an experimental value becomes an engineering decision, update the owning source/shared parameter/interface, run the required invalidation/QA chain, and commit it to the repository.

This makes the browser suitable not only for static inspection but also for parameterized motion and design discussions from a phone.

## 6. Renderer/toolchain

Pin the WebAssembly CAD build explicitly. For OpenSCAD, use a modern build and Manifold backend where supported. Toolchain changes are engineering changes and require validation.

## 7. Source integrity

- snapshot source from the checked-out deployment commit;
- store SHA-256 for every source file;
- verify bytes before mounting in the worker;
- version browser assets by commit;
- expose source-at-this-commit links.

Displayed STL is derived data, not a second source of truth.

## 8. Worker lifecycle

```text
user requests render
→ create fresh worker
→ initialize runtime
→ verify/mount dependency closure
→ apply review-only -D overrides, if any
→ render
→ transfer binary STL
→ terminate worker
```

Cancel, selection change, navigation, crash or error terminates the worker. Do not accumulate orphan CAD jobs.

## 9. Prebuilt preview exception

Do not maintain prebuilt previews by default. Introduce one only after measured evidence that an important entry remains impractically slow despite worker execution, modern WASM, Manifold, dependency closure and binary STL. Document the reason and retain browser source rendering as the reproducible path.

## 10. Mobile acceptance gate

A browser review implementation passes only if:

- ordinary parts/useful assemblies render practically;
- UI remains responsive;
- elapsed time advances visibly;
- Cancel responds;
- source/docs remain usable;
- unrelated files do not join every render;
- full assembly can be regenerated from exact source;
- useful parametric/motion poses can be inspected with bounded review-only overrides when the project exposes suitable parameters;
- duplicate CI render infrastructure is absent unless justified by measurement.
