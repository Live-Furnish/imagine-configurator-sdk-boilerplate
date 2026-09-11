# Importing the sample catalog

`anne-import.zip` is a complete, ready-to-import catalog for the **Anne modular sofa** —
workbook, 51 models, textures and thumbnails. Importing it gives you a populated
configurator in a few minutes, and a worked example of the import format to model your own
data on.

You need an organisation and an owner login first — see [step 1 of the README](../README.md#1-sign-up).

> **The short version:** download the zip → **extract it** → drop the extracted
> `anne-import` **folder** on the importer → dry-run → import → publish the layout.

---

## 1. Download

The bundle is a **GitHub release asset**, not a file in this repo — at ~87 MB it has no
business in every clone.

Grab `anne-import.zip` from the
[latest release](https://github.com/pnkj1002/imagine-configurator-sdk-boilerplate/releases/latest),
or from the command line:

```bash
gh release download --repo pnkj1002/imagine-configurator-sdk-boilerplate \
  --pattern 'anne-import.zip'
```

## 2. Extract it

```bash
unzip anne-import.zip
```

You get a single `anne-import/` folder:

```
anne-import/
├── catalog.xlsx              ← the import workbook, 13 sheets
├── models/                   ← 51 component GLBs
├── textures/                 ← 221 upholstery + leg-finish maps
├── assets/thumbnails/…       ← 20 module thumbnails
├── white_studio_02_2k.hdr    ← studio HDRI used by the system environment
└── README.md                 ← generator notes (see the caveat below)
```

**Extracting is not an optional convenience — do not upload the zip as-is.** Its root is the
wrapping `anne-import/` folder rather than `catalog.xlsx`, which is not the shape the zip
upload path expects. The folder picker in the importer *does* strip that leading segment, so
the extracted folder is the reliable route. If you specifically need a zip, re-zip the
**contents** of `anne-import/` so `catalog.xlsx` sits at the archive root — not the folder
itself.

## 3. Run the import

1. Admin panel → **Catalog Import** (`/catalog-import`).
2. Step 1: choose **select folder** and pick the extracted `anne-import` folder, or drag the
   whole folder onto the picker. The wizard finds `catalog.xlsx` and resolves the
   `models/…`, `textures/…` and `assets/…` paths relative to it.
3. Run the **dry-run validation**. It reports unresolved file references, duplicate names and
   malformed JSON columns without writing anything. This bundle is clean: all 103 file
   references in the workbook resolve against the files in the folder.
4. Review the summary, then **import**.

## 4. Publish the layout

The importer stops at the **draft**, exactly as the admin UI does when you edit a system by
hand. Until you publish, the configurator has nothing live to load and mounts into an empty
scene.

→ Open **Anne Modular Sofa** → **Layouts** tab → **Publish**.

This is the most common reason a fresh import renders an empty canvas.

## 5. Point the app at it

The system id is in its admin URL (`…/configurable-systems/2` → `2`). Put it in `.env.local`
and restart the dev server — Vite reads env files at startup only:

```bash
VITE_SYSTEM_ID=2
```

---

## What lands in your catalog

Counts below are read from `catalog.xlsx` itself, sheet by sheet.

| Sheet | Rows | What it creates |
|---|---:|---|
| Tag | 2 | `anne`, `sofa` |
| Product Category | 1 | Sofas |
| Component Group | 3 | Arms, Legs, Cushions |
| Option Set | 7 | Sofa Layouts, Upholstery Fabric, Leg Finish, Arm Style, Leg Style, Modules, Cushions |
| Material | 19 | 15 upholstery fabrics + 4 leg finishes, each with a diffuse texture |
| Component | 51 | 20 modules (ungrouped) + 6 arms + 6 legs + 19 cushions |
| Option | 41 | 2 layouts, 6 arms, 6 legs, 14 modules, 13 cushions — 25 of them carry `swaps` |
| Product Graph | 1 | `Anne` (category Sofas, `placement_type=freestanding`) |
| Product Variant | 15 | One default variant per module, each linked to its module component |
| Configuration Preset | 2 | Oppsett F (L-shaped, left corner), Oppsett H (L-shaped, right corner) |
| Configurable System | 1 | **Anne Modular Sofa** — 6 option sets attached, default preset Oppsett F |
| Rule | 7 | 3 arm-visibility + 4 leg hide/rotate rules (custom DSL) |
| Constraint | 4 | `max_count` caps (≤2 large/small corners, ≤2 large/small chaises per scene) |

Field-by-field notes, including every JSON column shape:
**[`../data-samples/anne-import/CATALOG.md`](../data-samples/anne-import/CATALOG.md)**.

### Two things worth knowing before you go looking for them

- **The Cushions option set is not attached to the system.** The Configurable System row
  lists six of the seven sets; Cushions is imported but unbound. Attach it in the Option Sets
  tab of the system if you want cushions selectable in the UI.
- **Only 19 of the 221 texture files are referenced.** The bundle ships the full upholstery
  library, but the workbook wires up 15 fabrics and 4 leg finishes. The rest are there for
  you to add Material rows against — a ready-made exercise in extending a catalog.

### About the README inside the bundle

`anne-import/README.md` is the notes from the generator, and it describes a **larger earlier
run** (222 materials, 20 variants, 6 presets, 3 rules). The shipped workbook is the smaller
set in the table above. Where the two disagree, **`catalog.xlsx` is the source of truth** —
it is what the importer actually reads. Its explanations of the *format* (the `swaps` shape,
the centimetre/Z-up to metre/Y-up conversion, the draft-and-publish workflow) remain accurate
and are worth reading.

---

## After the import: what the flat format cannot carry

The workbook creates catalog **primitives**. Some behaviour lives in the placement engine and
has no column in a flat sheet — wire it in the admin UI afterwards:

- **Module chaining** — plug/socket connectors, corner 90° rotation for L and U shapes.
- **Leg hide/show** at seams, and thinning on long runs.
- **Per-module cushion matching** and fallbacks.
- **End-only arm placement** with `useSideBounds` auto-alignment.
- **Per-placement `initial_options`** — which fabric or leg is pre-selected on each module in
  a preset. Imported empty; set it in the preset editor.

**Preset placements are best guesses.** Module sequences were inferred from the layout names,
and positions chained from each module connector offsets. They import, they render, and they
will likely need nudging in the preset editor.

## The `swaps` column

The one JSON column worth understanding before you author your own catalog. Each arm, leg and
cushion option carries an array describing which components get installed into which slots
when that option is selected:

```json
[
  {"slot_name": "arm_left",  "component": "Anne Arm 1"},
  {"slot_name": "arm_right", "component": "Anne Arm 1"}
]
```

Each entry becomes one `OptionSwap` row. Every entry here is a **wildcard** — it applies to
any product variant with a matching `slot_name`, which is why one arm option writes the same
component into both `arm_left` and `arm_right` across every module. Add a `variant_names`
array to scope a swap to specific variants instead:

```json
[
  {"slot_name": "arm_left", "component": "Anne Arm 1",
   "variant_names": ["Anne 1 Seater — Default"]}
]
```

Slots used by this bundle: arms → `arm_left`, `arm_right`; legs → `leg_left_front`,
`leg_left_back`, `leg_right_front`, `leg_right_back`; cushions → the cushion slot of the
module (`anne_1_seater_cushion_hard`, `anne_corner_small_cushion_hard`, …).

Swaps are applied directly in the evaluate pipeline right after defaults resolve. Rule
effects — like the arm-visibility rules in the Rule sheet — can override any slot a swap
wrote to.

## Troubleshooting the import

| Symptom | Cause |
|---|---|
| Wizard cannot find `catalog.xlsx` | You uploaded the zip instead of the extracted folder — see step 2 |
| Unresolved file references in dry-run | A wrapping folder was added, or the folder was moved without its subdirectories |
| Import succeeds, configurator is empty | The layout was never published — step 4 |
| Empty scene, valid key | `VITE_SYSTEM_ID` names a different system |
| Cushions missing from the UI | The Cushions option set is not attached to the system by default |

More: **[troubleshooting.md](troubleshooting.md)**.

## Licence

The assets in this bundle are **non-commercial only, permanently** — a subscription does not
unlock them. See [`../data-samples/LICENSE-ASSETS.md`](../data-samples/LICENSE-ASSETS.md).
Replace them with artwork you own before deploying anything commercially.
