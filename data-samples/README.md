# Sample catalog data

What is **in this folder** and what is **downloaded**, and why the split exists.

## In the repo

| Path | What |
|---|---|
| [`anne-import/CATALOG.md`](anne-import/CATALOG.md) | Field-by-field reference for the Anne sofa bundle — every sheet, every JSON column |
| [`LICENSE-ASSETS.md`](LICENSE-ASSETS.md) | Asset licence: **non-commercial, permanently** |

## Not in the repo

The bundles themselves. `anne-import.zip` is ~87 MB and 295 files; nobody wants that in every
clone, and the kitchen bundle is over GitHub's 100 MB per-file limit outright. They ship as
**release assets**:

→ [latest release](https://github.com/pnkj1002/imagine-configurator-sdk-boilerplate/releases/latest)

```bash
gh release download --repo pnkj1002/imagine-configurator-sdk-boilerplate \
  --pattern 'anne-import.zip'
```

`.gitignore` blocks `data-samples/*.zip` and the asset subfolders (`models/`, `textures/`,
`materials/`, `thumbnails/`, `assets/`), so an extracted bundle sitting here never gets
committed by accident. That makes this folder a convenient place to extract one.

## Using a bundle

**Extract it first** — the zip contains a wrapping `anne-import/` folder, so uploading the
zip itself does not work. Drop the extracted folder on the importer's folder picker.

Full walkthrough: **[../docs/import-sample-catalog.md](../docs/import-sample-catalog.md)**.

## Rebuilding a bundle

From a source folder containing `catalog.xlsx` plus its asset subfolders:

```bash
npm run zip:samples                      # builds whatever it can find
npm run zip:samples -- --only anne       # just the sofa
npm run zip:samples -- --only anne --source ../anne-import
```

Output lands in `data-samples/dist/` (gitignored). Upload it with:

```bash
gh release upload <tag> data-samples/dist/anne-import.zip
```

See [`../scripts/build-sample-zips.mjs`](../scripts/build-sample-zips.mjs).

## Licence

The 3D assets in these bundles are **non-commercial only, and stay that way** — a
subscription unlocks commercial use of the code and SDK, never the artwork. Read
[LICENSE-ASSETS.md](LICENSE-ASSETS.md) before shipping anything.
