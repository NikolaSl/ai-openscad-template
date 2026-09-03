# Repository Contract — persistent engineering memory

The repository is the persistent engineering memory. Chat history is disposable working context.

## Continuity invariant

No decision required to continue engineering work may exist only in chat. Before a logical design step is accepted, commit enough information that a completely new human/AI session can reconstruct the project and continue without the previous conversation.

The repository must preserve, as applicable:

- requirements and constraints;
- complete planned part decomposition;
- interaction/interface contracts;
- physical solid-body relationship classifications;
- constraint/DOF register and support/load-path decisions;
- shared parametric configuration and derived datums;
- dependency/build order;
- part and subsystem status;
- current partial/full assembly;
- visual/geometric/mechanical-integrity/motion QA procedures and accepted checkpoints;
- unresolved assumptions and HOLD/VERIFY items;
- durable design decisions and rationale;
- live printable-part list and non-printed BOM;
- physical calibration/fit state;
- exact assembly order and service constraints;
- browser-review/publishing mechanism.

## Fresh-session bootstrap

An AI/coding agent should start with `AGENTS.md`, then read the engineering sources below. A human session may start directly with this contract.

1. `AGENTS.md` — concise operational instructions for agents.
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
16. relevant QA plans/results, current assemblies and neighboring part sources.

Do not infer current state from old chat snippets when the repository can answer it.

## Atomic design-step acceptance

A new or materially changed part is not DONE merely because a `.scad` file exists.

```text
part source
+ shared parameters/interfaces
+ solid-body relationship classification
+ support / constraint / load-path definition
+ per-part geometric/visual QA
+ neighbor/context + fastener-envelope QA
+ current assembly integration
+ mechanical-integrity pairwise checks
+ motion/adjustment state-space QA when affected
+ PARTS/INTERFACES/constraint-register update
+ ASSEMBLY/BOM update
+ DECISIONS update when durable rationale matters
+ PROJECT_STATE/HOLD update
+ browser reviewability
= accepted design step
```

If any required item is missing, the part remains provisional.

## Mechanical-integrity invariant

The default physical rule is: **two solid bodies may not occupy the same volume unless an explicit interface contract defines the relationship as an intended fit/contact/passage/embedded/bonded condition.**

Bodies that move together under the same transform still require internal interference checks. Operational motion, adjustment travel and relevant configuration/service states all belong to the QA state space.

A CAD trajectory is not accepted unless the real mechanism contains a physical constraint chain that makes the intended DOF possible while removing unintended rigid-body DOFs. Bearings, shafts, guides, rails, slots, hinges, linkages, flexures, locators, retention and fasteners are part of that proof. See `MECHANICAL_INTEGRITY_PROTOCOL.md`.

## Decision-memory rule

Use `DECISIONS.md` for accepted/provisional/superseded choices whose rationale would matter in a future fresh session. It is not a replacement for Git history, numerical parameters or interface contracts. Keep old superseded decisions with a pointer to the replacement rather than erasing the reasoning.

## Browser/mobile integration

Human review must work from an ordinary modern phone/tablet browser. The normal path is exact deployed source → dependency closure → OpenSCAD WebAssembly in a Web Worker → binary STL → Three.js. Heavy CAD must never run on the UI thread. See `BROWSER_REVIEW_PROTOCOL.md`.

Every printable part and useful subsystem/full assembly must have a browser-renderable entry point under the published source tree.

## Live assembly/BOM rule

`ASSEMBLY.md` is a live design product, not end-of-project documentation. Whenever an accepted part/interface changes, immediately update affected quantities, purchased/fabricated hardware, tools/consumables, fit tests, mating relationships, support/retention roles, order of assembly, tool access, motion checks and service constraints.

The BOM must always answer: **what must be printed, bought, fabricated and prepared to build everything designed so far?**

## Assembly sequence is a design constraint

A geometrically valid final state is not acceptable if it cannot actually be assembled or serviced. Context QA must consider intermediate assembly states, fastener insertion, bearing installation, tool reach, trapped parts, disassembly path, temporary loss of supports and movement required for service.

## Human review gates

Stop for human review at least after:

- initial machine decomposition;
- shared parameter/interface/constraint architecture;
- each major subsystem integration;
- a large recursive backtrack;
- a change to a validated high-fanout interface or support chain;
- before expensive/long physical prints;
- before final production assembly.

The review package should expose current assembly, changed part, critical sections, key parameter/interface/constraint changes, current state/BOM, unresolved risks and proposed next step.

## Definition of done

A mechanical design step is complete only when another session can:

1. understand why the part exists and what it interfaces with;
2. understand how it is supported/retained and what DOFs remain;
3. regenerate it from source/common parameters;
4. reproduce relevant solid-pair, geometric and state-space QA;
5. place it in the current assembly;
6. inspect it in the browser without freezing the page;
7. identify required non-printed items and fasteners;
8. physically integrate it using `ASSEMBLY.md`;
9. know remaining HOLD/VERIFY items and durable decisions;
10. continue the next dependency without recovering chat history.
