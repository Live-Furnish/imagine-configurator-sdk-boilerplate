# `anne-import` — catalog reference

Field-by-field notes for the **Anne modular sofa** bundle (`anne-import.zip`). This file is
in the repo so you can read the schema without downloading 87 MB; the bundle itself is a
[release asset](https://github.com/pnkj1002/imagine-configurator-sdk-boilerplate/releases/latest).

How to actually run the import: **[../../docs/import-sample-catalog.md](../../docs/import-sample-catalog.md)**.

Every number here was read from the shipped `catalog.xlsx`.

---

## Bundle contents

| Path | Files | Notes |
|---|---:|---|
| `catalog.xlsx` | 1 | 13 sheets, ~50 KB |
| `models/` | 51 | Component GLBs — all 51 referenced by the workbook |
| `textures/` | 221 | Upholstery + leg-finish maps — **19 referenced**, the rest are spare |
| `assets/thumbnails/module_thumbnails/` | 20 | One PNG per module |
| `white_studio_02_2k.hdr` | 1 | Studio HDRI, named by the system `environment` JSON |
| `README.md` | 1 | Generator notes — describes an earlier, larger run; see the caveat below |
| **Total** | **295** | 88.1 MB uncompressed, 86.5 MB zipped |

All 103 file references in the workbook resolve against these files, so the dry-run
validation passes clean.

---

## Sheets

The workbook has 13 sheets. Import order matters — the importer resolves names to ids as it
goes, so a sheet may only reference entities defined in a sheet above it.

| # | Sheet | Rows | Key columns |
|---:|---|---:|---|
| 1 | Tag | 2 | `name`, `description` |
| 2 | Product Category | 1 | `name`, `description`, `icon` |
| 3 | Component Group | 3 | `name`, `description`, `pivot`, `configurable_systems` |
| 4 | Option Set | 7 | `name`, `type`, `sequence`, `material_targets`, `default_option` |
| 5 | Material | 19 | `name`, `thumbnail`, `material_json`, `tags`, `option_set`, `texture_diffuse`, `texture_normal`, `texture_roughness` |
| 6 | Component | 51 | `name`, `material_slot_name`, `default_material`, `model_path`, `groups`, `default_position_*`, `default_rotation_*` |
| 7 | Option | 41 | `name`, `slug`, `parent_option_set`, `thumbnail`, `price_delta`, `color`, `value_kind`, `value_name`, `swaps` |
| 8 | Product Graph | 1 | `name`, `category`, `thumbnail`, `width`/`height`/`depth`, `weight`, `base_price`, `placement_type`, `movable`, `tags` |
| 9 | Product Variant | 15 | `name`, `product_graph`, `option_set`, `components`, `corner`, `edge`, `configurable_systems` |
| 10 | Configuration Preset | 2 | `name`, `description`, `thumbnail`, `placements` |
| 11 | Configurable System | 1 | `name`, `description`, `thumbnail`, `environment`, `option_sets`, `default_preset` |
| 12 | Rule | 7 | `name`, `priority`, `hard`, `trigger_type`, `trigger_option`, `trigger_params`, `trigger_components`, `effect_type` |
| 13 | Constraint | 4 | `name`, `constraint_type`, `target_kind`, `target_name`, `value_json`, `hard`, `configurable_systems` |

---

## Option Sets (7)

The `type` column drives what selecting an option actually does — it is the single most
important field in the workbook.

| Name | `type` | Default option | Effect |
|---|---|---|---|
| Sofa Layouts | `load_configuration` | Oppsett F | Loads a whole Configuration Preset |
| Upholstery Fabric | `finish_change` | Alpine 1 Natural | Swaps the material on matching slots |
| Leg Finish | `finish_change` | Oak Black | Swaps the material on leg slots |
| Arm Style | `load_new_component` | Anne Arm 1 | Installs a component via `swaps` |
| Leg Style | `load_new_component` | Anne Leg Pyra 6 5 16 | Installs a component via `swaps` |
| Modules | `load_new_product` | — | Adds a product variant to the scene |
| Cushions | `load_new_component` | — | Installs a cushion via `swaps` |

> **Cushions is not attached to the Configurable System.** The system `option_sets` column
> lists the other six. The set imports fine but stays unbound — attach it in the Option Sets
> tab of the system if you want it in the UI.

## Materials (19)

Each row names an Option Set in its `option_set` column, and the importer **auto-creates one
Option per material**. That is why the Option sheet has no Upholstery Fabric or Leg Finish
rows — those 19 options are spawned during import, not authored.

- **Upholstery Fabric — 15:** Al 510 Black, Al 524 Camel, Al 528 Stark White, Al 539 Safari,
  Al 540 Anthracite, Al 545 Vintage Cognac, Al 551 Soft Grey, Al 552 Tan Saddle, Al 553
  Brown, Alpine 1 Natural, Alpine 5 Beige, Alpine 15 Brown, Alpine 101 Ivory, Alpine 149
  Steel, Attraction 101 Ivory
- **Leg Finish — 4:** Oak Black, Leg C4 Oak Nature, Leg C6 Oak White, Leg C13 Oak Grey

Each carries a `texture_diffuse`. PBR params (roughness, metalness, tiling) are **not** in
the flat sheet — tune them in the UI or via `material_json` afterwards.

**Extending it:** `textures/` holds 221 files and only 19 are wired up. Adding a fabric is
one new Material row pointing at an existing texture — no new assets needed.

## Components (51)

| Group | Count | Examples |
|---|---:|---|
| *(ungrouped — modules)* | 20 | 1/1.5/2/2.5/3/3.5 seaters, duos, corners, chaises, ottomans, end modules, table module |
| Arms | 6 | Anne Arm 1 … |
| Legs | 6 | Anne Leg Pyra 6 5 16, Anne Leg Angle 15 15, … |
| Cushions | 19 | `anne_1_seater_cushion_hard`, `anne_corner_small_cushion_hard`, … |

Modules are deliberately ungrouped — they are placed as **product variants**, not swapped
into slots. Arms, legs and cushions are grouped because they are slot-installed via `swaps`.

`model_path` is relative to `catalog.xlsx` (`models/anne_2_seater.glb`).

## Options (41)

| Parent set | Options | Carries `swaps` |
|---|---:|---|
| Sofa Layouts | 2 | no (`value_kind=preset`) |
| Arm Style | 6 | yes — 2 rows each (`arm_left`, `arm_right`) |
| Leg Style | 6 | yes — 4 rows each (the four leg slots) |
| Modules | 14 | no (`value_kind` targets a variant) |
| Cushions | 13 | yes — 1 row each (module cushion slot) |

25 of the 41 options carry a non-empty `swaps` array. Shape and semantics:
**[import-sample-catalog.md — the `swaps` column](../../docs/import-sample-catalog.md#the-swaps-column)**.

## Product Graph (1) and Variants (15)

One graph, `Anne` — category Sofas, `placement_type=freestanding`. Fifteen variants hang off
it, one per module, named `Anne <Module> — Default`:

```
Anne 1 Seater — Default          Anne 3 Seater — Default
Anne 1 5 Seater — Default        Anne 3 Seater Duo — Default
Anne 1 5 Seater Large — Default  Anne 3 5 Seater — Default
Anne 2 Seater — Default          Anne 3 5 Seater Duo — Default
Anne 2 5 Seater — Default        Anne Corner Small — Default
Anne End Module Left — Default   Anne Ottoman Small — Default
Anne End Module Right — Default  Anne Ottoman Large — Default
Anne Table Module — Default
```

### The `components` column

A JSON array of `{ component, position, rotation }` — the module body at the origin, plus its
legs at real positions and its cushion:

```json
[
  {"component": "anne_2_seater",      "position": [0, 0, 0],            "rotation": [0, 0, 0]},
  {"component": "anne_leg_pyra",      "position": [-0.485, 0, 0.075],   "rotation": [0, 0, 0]},
  {"component": "anne_2_seater_cushion_hard", "position": [0, 0, 0],    "rotation": [0, 0, 0]}
]
```

**Coordinate conversion.** Source assembly space is centimetres, Z-up (`x` lateral, `y`
depth, `z` height, legs at `z=0`). The scene is metres, Y-up. So
`(x, y, z)cm → (x/100, z/100, y/100)m` — a 2-seater leg at `±48.5 cm` lands at `±0.485 m`
with `y=0` (on the floor). Rotations are kept as authored; their yaw is already about the
vertical axis.

A plain comma-separated name list is also accepted, and gives every component an identity
transform.

**Arms are deliberately absent** — they are end-only and placed at runtime by the Arm Style
options plus the arm-visibility rules.

**Versioning note:** product variants are fully version-tracked, so the importer attaches
components through the **draft workflow** — it opens a draft, adds each component, and
publishes a new version. The direct add-component path does not apply edits under full
versioning.

## Configuration Presets (2)

| Name | Description |
|---|---|
| Oppsett F | L-shaped sofa, left corner — default preset of the system |
| Oppsett H | L-shaped sofa, right corner |

`placements` holds a JSON array of `{ variant, position, rotation }`; the importer resolves
each variant name to an id and builds the preset `products[]`.

**These are best guesses.** Sequences were inferred from the layout names, positions chained
from connector offsets. `initial_options` (per-placement option pre-selection) is left empty.
Expect to adjust both in the preset editor.

## Configurable System (1)

**Anne Modular Sofa** — 6 option sets attached (all but Cushions), `default_preset` = Oppsett F.

`environment` is an inline JSON blob, not a file path: ACESFilmic tone mapping at exposure
1.04, `#ecebea` background, four lights (ambient, hemisphere, key + fill directionals), PCF
shadows, and `white_studio_02_2k.hdr` at intensity 1 with `as_background: false`.

The `default_preset` is written to the **draft** layout of the system. **Publish it from the
Layouts tab** or the configurator loads nothing.

## Rules (7)

All custom-DSL. Three govern arm visibility, four govern legs:

- Arm visibility — middle of row (hide both arms)
- Arm visibility — leftmost end (hide right arm)
- Arm visibility — rightmost end (hide left arm)
- Hide front legs when Beinramme selected
- Anne Leg Angle 15 15 rotations (`trigger_type=component_loaded`)
- Hide legs on sofas except corner
- Hide middle legs on right end sofa

Component swaps used to live here as `swap_via_group` rules. Those were retired; swaps now
flow through the `Option.swaps` column. Rule effects still win over swaps on any slot they
both touch.

## Constraints (4)

`max_count` caps, scope `scene` — the one constraint shape that needs no product ids in its
value:

```json
{"max": 2, "scope": "scene"}
```

Applied to large corners, small corners, large chaises and small chaises. For real adjacency
logic, add `mutually_exclusive` or `requires_neighbor` constraints in the Constraints UI.

---

## Known data quirks

Carried over from the generator, and already handled in the shipped workbook:

- Duplicate downloads (`… (1).glb`, `… (2).glb`) were de-duplicated.
- Two upholstery rows (`nolio_07`, `nolio_08`) were skipped — their textures are absent.
- Material names derive from each unique `material_id`, because raw `name_english` values
  like "Black" repeat across collections.
- PBR params from the source CSVs are not imported.

## The bundled README

`anne-import/README.md` describes a **larger earlier generation run** — 222 materials, 20
variants, 6 presets, 3 rules. The shipped `catalog.xlsx` is the smaller set documented here.
**The workbook is the source of truth**; it is what the importer reads. The format
explanations in that README are still correct.

## Licence

Non-commercial only, permanently — a subscription does not unlock these assets.
See [../LICENSE-ASSETS.md](../LICENSE-ASSETS.md).
