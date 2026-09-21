# Sample catalog data

Two complete, ready-to-import catalogs. They are **hosted, not committed** — a clone stays
small, and you pull only the bundle you actually want.

| Bundle | Download | Size | Catalog | Assets |
|---|---|---|---|---|
| **Sectional sofa** — the Anne modular sofa | [sectional-sofa-import.zip](https://cnfs.imagine.io/sample-data/sectional-sofa-import.zip) | 84 MB | 33 components, 12 product variants, 4 option sets, 37 options, 16 materials, 3 presets, 3 constraints, 1 rule | 32 GLB models, 30 material textures, 37 thumbnails |
| **Kitchen** — cabinets, appliances, worktops | [kitchen-import.zip](https://cnfs.imagine.io/sample-data/kitchen-import.zip) | 198 MB | 319 components, 72 product variants, 15 option sets, 128 options, 15 materials, 74 rules, 20 constraints, 445 anchor points | 635 GLB models, 100 SVG icons, 27 textures, 1 studio HDRI |

Start with the **sofa**: less than half the size, and small enough to read end to end in the
workbook. The kitchen is the one to look at for anchor points, product option sets and rules
at scale.

## Get one

```bash
cd data-samples
curl -O https://cnfs.imagine.io/sample-data/sectional-sofa-import.zip
unzip sectional-sofa-import.zip
```

PowerShell:

```powershell
cd data-samples
Invoke-WebRequest https://cnfs.imagine.io/sample-data/sectional-sofa-import.zip -OutFile sectional-sofa-import.zip
Expand-Archive sectional-sofa-import.zip -DestinationPath .
```

Swap `sectional-sofa-import` for `kitchen-import` for the other one. Downloads and extracted
folders under `data-samples/` are gitignored, so they will not end up in a commit.

## Extract before you import

**Not optional.** Each zip holds a single wrapping folder, so `catalog.xlsx` is not at the
archive root and the importer cannot read the zip as-is:

```
sectional-sofa-import/
├── catalog.xlsx              ← the import workbook, 14 sheets
├── README.md
├── models/                   ← 32 component GLBs (incl. models/CUSHIONS/)
├── materials/<name>/         ← texture maps, one folder per material
└── thumbnails/               ← 37 module thumbnails
```

```
kitchen-import/
├── catalog.xlsx              ← 16 sheets, including Anchor Point and Product Option Set
├── README.md
├── models/                   ← 635 GLBs across appliances/, cabinets/, backsplash/, …
├── materials/<name>/         ← granite, stone, terrazzo, wood_01…wood_07
└── lightsettings/            ← studio HDRI
```

Give the importer the extracted **folder** (admin panel → **Import Catalog** → *select
folder*). It finds `catalog.xlsx` and resolves the `models/…` and `materials/…` paths
relative to it.

Full walkthrough, including the publish step everyone misses:
**[../docs/import-sample-catalog.md](../docs/import-sample-catalog.md)**.

## Also here

| Path | What |
|---|---|
| [`LICENSE-ASSETS.md`](LICENSE-ASSETS.md) | Asset licence: **non-commercial, permanently** |

## Licence

The 3D assets are **non-commercial only, and stay that way** — a subscription unlocks
commercial use of the code and SDK, never the artwork. Read
[LICENSE-ASSETS.md](LICENSE-ASSETS.md) before shipping anything.
