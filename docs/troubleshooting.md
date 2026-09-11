# Troubleshooting

Symptoms in the order you are likely to hit them: install → boot → empty scene → import →
runtime.

---

## Install

### The SDK behaves like an older build, or a documented export is missing

You probably installed without the `@beta` tag. This is the staging package; current builds
publish under the `beta` dist-tag, and `latest` is **not** kept in step — it can sit several
betas behind. Installing without the tag does not fail; it silently gives you the older build.
Compare `npm ls @imagineio/configurator-sdk-staging` against
`npm view @imagineio/configurator-sdk-staging dist-tags`, then reinstall:

```bash
npm install @imagineio/configurator-sdk-staging@beta
```

### `ERESOLVE could not resolve` around `react` / `@react-three/fiber`

React 19 is in the project. The SDK 3D stack needs React 18 (`@react-three/fiber@8` does not
support 19), and a fresh Vite template scaffolds 19.

```bash
npm install react@^18.2 react-dom@^18.2
npm install -D @types/react@^18.3 @types/react-dom@^18.3
```

Pin the **types** as well, even in a plain JavaScript project. Mismatched types throw no
error — you just get wrong autocomplete everywhere.

`--legacy-peer-deps` will silence this and leave you with a broken 3D scene. Don't.

---

## Boot

### The page says "Setup needed"

`VITE_API_KEY` or `VITE_SYSTEM_ID` is missing from `.env.local`. Two common causes:

- You copied `.env.example` but never replaced `ck_replace_me`.
- You edited `.env.local` while the dev server was running. **Vite reads env files at
  startup only** — restart `npm run dev`.

### Everything loads, but saving or sharing silently does nothing

Your key is **read-only**. Check the prefix: `ck_ro_…` is read-only, `ck_…` is read & write.
A read-only key serves catalog, evaluate and pricing — it cannot save projects or upload
renders, and it cannot mint a read-write session token, so no client-side change works
around it. Create a read & write key, or edit the existing key's scope in the admin panel.

### 401 on every request

Wrong or revoked key. Keys are shown in full exactly once, at creation; if you did not copy
it, create a new one (admin panel → **Settings → API Keys**). A key only ever sees its own
organisation data.

### Blank canvas, `instanceof` errors from `three`

Two copies of `three` in the bundle. Add the Vite plugin, which dedupes `three` and `react`
and serves the SDK static assets (Draco decoders, fonts):

```js
// vite.config.js
import imagineConfigurator from '@imagineio/configurator-sdk-staging/vite';
export default defineConfig({ plugins: [react(), imagineConfigurator()] });
```

### The configurator renders, but with no height

The configurator fills its mount element. Give it a real one:

```css
html, body, #root { height: 100%; margin: 0; }
```

---

## Empty scene, no errors

The key is valid and nothing throws — you just get an empty canvas. In order of likelihood:

1. **The layout was never published.** Both the importer and the admin UI stop at the
   **draft**. Open the system → **Layouts** tab → **Publish**. This is the single most common
   cause after a fresh import.
2. **The org has no catalog.** There is no built-in demo data; a valid key pointed at an
   empty org gives an empty scene. Import the sample:
   [import-sample-catalog.md](import-sample-catalog.md).
3. **`VITE_SYSTEM_ID` names the wrong system.** Find the id in the admin URL
   (`…/configurable-systems/2` → `2`). Restart the dev server after changing it.

---

## Import

| Symptom | Cause |
|---|---|
| Wizard cannot find `catalog.xlsx` | You uploaded the zip as-is. Extract it and drop the extracted **folder** — the zip has a wrapping folder at its root |
| Unresolved file references in dry-run | The folder was moved without its subdirectories, or an extra wrapping folder was added. `models/…` paths resolve relative to `catalog.xlsx` |
| Duplicate name errors | The catalog already has entities from a previous import. Import into a clean org, or rename |
| Malformed JSON column | `swaps`, `components`, `placements`, `value_json` and `environment` are JSON. A trailing comma or a smart quote from a spreadsheet editor will fail the dry-run |
| Import succeeded, configurator empty | Publish the layout — see above |
| Cushions do not appear in the UI | The Cushions option set ships unattached to the system. Attach it in the system's Option Sets tab |
| Preset layouts look wrong | Preset placements are best guesses inferred from layout names. Adjust in the preset editor |

The dry-run writes nothing — run it every time and read the report before importing.

---

## Runtime

### Custom component / renderer / strategy silently does nothing

Most registries fail silently by design — a wrong key just means the built-in keeps
rendering. Check what actually registered:

| Registry | Inspect with | Usual mistake |
|---|---|---|
| `ui.registerComponent` | `ui.listComponentOverrides()`, `ui.hasComponent(name)` | Wrong internal component name |
| `scene.registerRenderer` | `scene.listRenderers()` | Used the **slot** name; the key is the lowercased **component** name |
| `ui.registerButton` | return value is a no-op unregister if ignored | Missing `slot`, or missing both `label` and `icon` |
| `ui.registerLayout` | `ui.activeLayout()` | Replaced `'default'` on a system that ships its own named layout |
| `placement.registerStrategy` | — | Missing both `computeLayout()` and `mode:'scene-owned'` |

### The theme resets itself

You called `setSystemTheme()` at module top level. The backend theme record lands during boot
and overwrites anything set before it. Apply it from `scene.onReady()`:

```js
scene.onReady(() => setSystemTheme({ colors: { primary: '#DD5E27' } }));
```

### `placement.setStrategy()` changes nothing visible

It notifies nobody. The change stays invisible until something repaints the scene.

### Quote template renders blank

The builder receives the real shape from `quote.read()` — `{ lines, totals, … }`, not the
`lineItems` / `total` shape older docs showed.

---

## Content Security Policy

Two things load at runtime from Google rather than from the package:

| What | Origin | Directive | Override |
|---|---|---|---|
| AR viewer script | `https://ajax.googleapis.com` | `script-src` | `VITE_MODEL_VIEWER_SRC` to self-host |
| Theme fonts | `https://fonts.googleapis.com`, `https://fonts.gstatic.com` | `style-src`, `font-src` | Only loaded when a theme names a Google font |

Under a strict CSP, allow those or point the override at your own origin.

---

Still stuck? Include your SDK version (`npm ls @imagineio/configurator-sdk-staging`), the
system id, and whether the layout is published — those three answer most questions
immediately.
