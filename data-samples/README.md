# Sample catalog data

| Path | What |
|---|---|
| [`sectional-sofa-import.zip`](sectional-sofa-import.zip) | Sectional sofa bundle — **placeholder**, real assets not published yet |
| [`kitchen-import.zip`](kitchen-import.zip) | Kitchen bundle — **placeholder**, real assets not published yet |
| [`sectional-sofa-import/CATALOG.md`](sectional-sofa-import/CATALOG.md) | Field-by-field schema reference — every sheet, every JSON column |
| [`LICENSE-ASSETS.md`](LICENSE-ASSETS.md) | Asset licence: **non-commercial, permanently** |

## Status

Both zips currently contain only a README describing what will land in them. They exist so
the paths, naming and import flow are settled before the assets arrive — download one today
and you get no catalog data.

`CATALOG.md` is the exception: it documents the **real** sectional-sofa workbook, verified
sheet by sheet, so the schema is readable now even though the bundle is not downloadable.

Until the real assets ship, build a catalog by hand in the admin panel:
materials → components → product graphs and variants → option sets and options → a
configurable system.

## When a bundle lands

```bash
cd data-samples
unzip sectional-sofa-import.zip
```

**Extract it first.** Each zip contains a wrapping folder (`sectional-sofa-import/`), so
uploading the zip itself to the importer does not work — `catalog.xlsx` has to sit at the
root of whatever you hand it. Drop the extracted **folder** on the folder picker instead.

Full walkthrough: **[../docs/import-sample-catalog.md](../docs/import-sample-catalog.md)**.

> Extracting a real bundle here unpacks ~88 MB of models and textures. Keep those out of git
> — they belong in the zip, not loose in the tree.

## Licence

The 3D assets are **non-commercial only, and stay that way** — a subscription unlocks
commercial use of the code and SDK, never the artwork. Read
[LICENSE-ASSETS.md](LICENSE-ASSETS.md) before shipping anything.
