# Repository Contract — persistent engineering memory

The repository is the persistent engineering memory. Chat history is disposable working context.

## Continuity invariant

No decision required to continue engineering work may exist only in chat. Before a logical design step is accepted, commit enough information that a completely new human/AI session can reconstruct the project and continue without the previous conversation.

The repository must preserve, as applicable:

- requirements and constraints;
- complete planned part decomposition;
- interaction/interface contracts;
- shared parametric configuration and derived datums;
- dependency/build order;
- part and subsystem status;
- current partial/full assembly;
- visual/geometric/motion QA procedures and accepted checkpoints;
- unresolved assumptions and HOLD/VERIFY items;
- design decisions that affect downstream geometry;
- live printable-part list and non-printed BOM;
- physical calibration/fit state;
- exact assembly order and service constraints;
- browser-review/publishing mechanism.

## Fresh-session bootstrap

Read, in order:

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
13. relevant QA reports, assemblies and neighboring part sources.

Do not infer current state from old chat snippets when the repository can answer it.

## Atomic design-step acceptance

A new or materially changed part is not DONE merely because a `.scad` file exists.

```text
part source
+ shared parameters/interfaces
+ per-part geometric/visual QA
+ neighbor/context QA
+ current assembly integration
+ motion QA when motion envelope is affected
+ PARTS/INTERFACES update
+ ASSEMBLY/BOM update
+ PROJECT_STATE/HOLD update
+ browser reviewability
= accepted design step
```

If any required item is missing, the part remains provisional.

## Browser/mobile integration

Human review must work from an ordinary modern phone/tablet browser. The normal path is exact deployed source → dependency closure → OpenSCAD WebAssembly in a Web Worker → binary STL → Three.js. Heavy CAD must never run on the UI thread. See `BROWSER_REVIEW_PROTOCOL.md`.

Every printable part and useful subsystem/full assembly must have a browser-renderable entry point under the published source tree.

## Live assembly/BOM rule

`ASSEMBLY.md` is a live design product, not end-of-project documentation. Whenever an accepted part/interface changes, immediately update affected quantities, purchased/fabricated hardware, tools/consumables, fit tests, mating relationships, order of assembly, tool access, motion checks and service constraints.

The BOM must always answer: **what must be printed, bought, fabricated and prepared to build everything designed so far?**

## Assembly sequence is a design constraint

A geometrically valid final state is not acceptable if it cannot actually be assembled or serviced. Context QA must consider intermediate assembly states, fastener insertion, bearing installation, tool reach, trapped parts, disassembly path and movement required for service.

## Human review gates

Stop for human review at least after:

- initial machine decomposition;
- shared parameter/interface architecture;
- each major subsystem integration;
- a large recursive backtrack;
- a change to a validated high-fanout interface;
- before expensive/long physical prints;
- before final production assembly.

The review package should expose current assembly, changed part, critical sections, key parameter/interface changes, current state/BOM, unresolved risks and proposed next step.

## Definition of done

A mechanical design step is complete only when another session can:

1. understand why the part exists and what it interfaces with;
2. regenerate it from source/common parameters;
3. reproduce relevant QA;
4. place it in the current assembly;
5. inspect it in the browser without freezing the page;
6. identify required non-printed items;
7. physically integrate it using `ASSEMBLY.md`;
8. know remaining HOLD/VERIFY items;
9. continue the next dependency without recovering chat history.
