# Interface, Solid-Relationship and Motion Contracts

A part owns its local geometry; this file owns the **contract at boundaries between parts**, the physical relationship between relevant solid bodies, and the constraint architecture that turns desired CAD trajectories into real mechanism DOFs.

Use stable interface (`I-*`), relation (`R-*`), constraint (`K-*`) and motion/state (`M-*`) IDs so changes can invalidate the correct downstream scope.

## Contract rules

1. Never silently reuse an ID for a different meaning.
2. A dimension shared by multiple parts has one owner in `src/config.scad` or a purchased-hardware envelope.
3. Downstream parts derive from the contract; they do not independently redefine it.
4. Changing a contract invalidates all dependent geometry/QA until revalidated.
5. CAD validation does not imply physical fit/strength validation.
6. If no explicit relationship permits overlap/contact, physical solids default to `FORBIDDEN_OVERLAP`.
7. Bodies sharing the same motion transform still require internal interference checks.
8. A claimed autonomous/repeatable motion DOF is incomplete until the physical constraint chain that removes unwanted DOFs is defined.
9. A human, jig, gravity/friction or fixture used during setup is an **external constraint** and must be recorded rather than counted as mechanism geometry.

## Interface register

| ID | Side A | Side B | Contract | Parameter owner | CAD status | Physical status |
|---|---|---|---|---|---|---|
| `I-EXAMPLE` | `P-EXAMPLE` | environment | template demonstration only | `EXAMPLE_*` | template-only | N/A |

Replace this row with real neighboring interfaces before detailed project modeling.

## Solid-body relationship register

Classify every relevant potentially contacting/interfering pair using `MECHANICAL_INTEGRITY_PROTOCOL.md`.

| Relation ID | Body A | Body B | Relationship | Required clearance / fit | States where relevant | Status |
|---|---|---|---|---|---|---|
| `R-EXAMPLE` | example moving body | example fixed body | `CLEARANCE` | demo only | `M-EXAMPLE` | template-only |

Allowed relationship classes:

```text
FORBIDDEN_OVERLAP
CLEARANCE
INTENDED_CONTACT
MATING_FIT
KINEMATIC_CONTACT
FASTENER_PASSAGE
CAPTURED/EMBEDDED
BONDED/UNION
```

An intentional contact is an explicit exception, not a reason to omit the body from all collision reasoning.

## Constraint / DOF register

A free rigid body has six rigid-body DOFs. For every installed major body/subassembly, account for how real physical features remove the unwanted DOFs.

| Constraint ID | Body / subassembly | Claimed mechanism DOF | Physical constraint chain | Retention / end limits | External/operator constraints | Load / reaction path | Status |
|---|---|---|---|---|---|---|---|
| `K-EXAMPLE` | demo arm | 1 rotation | demo pivot/shaft | demo endpoints | none | demo support | template-only |

The real project should describe bearings, shafts, guides, rails, slots, hinges, locators, fasteners, anti-rotation features, axial retention and support spacing explicitly. A `rotate()`/`translate()` in an assembly file is not itself a constraint.

If a manual setup retains extra DOFs, do not force the register to say `1 DOF`. Instead record the coordinate actually constrained by the mechanism plus the residual motion and operator/fixture role. Example: a screw center constrained by a slot can have one translational coordinate while the payload on that screw still has yaw during loose manual adjustment.

## Motion / adjustment / configuration contracts

| Motion ID | State class | Moving body / modeled coordinate | Reference/fixed assembly | Range/checkpoints | Physical constraint ID | Residual/external constraints | Collision-sensitive relations | Status |
|---|---|---|---|---|---|---|---|---|
| `M-EXAMPLE` | operational | demo arm | demo base | `-45°..90°` | `K-EXAMPLE` | none | `R-EXAMPLE` | template-only |

Use motion IDs not only for motors but also for balancing slots, telescopic adjustments, movable clamps and other continuous/discrete states that affect geometry. For manual setup, name the constrained coordinate if the complete body is not self-guided.

## Parameter-to-contract invalidation map

| Parameter family | Interfaces / relations / constraints / motion to invalidate |
|---|---|
| `EXAMPLE_*` | `I-EXAMPLE`, `R-EXAMPLE`, `K-EXAMPLE`, `M-EXAMPLE` |

Replace the example with real parameter families before detailed modeling.

## Backtracking procedure

1. Name the failing interface/relation/constraint/motion ID.
2. Identify the nearest owner parameter/part.
3. Revise that owner rather than forcing downstream geometry.
4. Mark affected contracts/parts `NEEDS_REVALIDATION`.
5. Run geometric, solid-pair, constraint and state-space QA outward in dependency order.
6. Update parts, assembly/BOM and project state.
