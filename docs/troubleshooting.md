# Troubleshooting

Symptoms in the order you are likely to hit them: install → boot → empty scene → import →
runtime.

This page covers what you hit *in this boilerplate*. The SDK's own
**[Troubleshooting](https://configurator-platform.imagine.io/sdk/index.html#troubleshooting)**
section covers the runtime in more depth — session-token refusals field by field, the chat
runtime, and the `[sdk]` console lines that name the exact URL or registration that failed.

---

## Install

### The SDK behaves like an older build, or a documented export is missing

Your install is stale — the version on disk is behind the current release. A stale install
does not fail; it silently gives you the older build. Compare
`npm ls @imagineio/configurator-sdk` against `npm view @imagineio/configurator-sdk version`,
then reinstall:

```bash
npm install @imagineio/configurator-sdk@latest
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

### You edited or copied a file into `node_modules` and nothing changed

Vite serves a pre-bundled copy of the package from `node_modules/.vite/deps`, and that cache
is keyed on your lockfile and config — **not on file contents** — so a hand-copied file is
never seen. Delete `node_modules/.vite` and restart, or start once with `npx vite --force`.
A normal `npm install` of a new version changes the lockfile and invalidates the cache by
itself.

---

## Boot

### The page says "Setup needed"

`VITE_API_KEY` or `VITE_SYSTEM_ID` is missing from `.env.local` — this is the hint screen
`src/main.jsx` renders, not an SDK error. Two common causes:

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
organisation data. The console line names which of the three it is: missing, invalid, or
revoked.

Once you move to server-minted tokens
([Going to production](../README.md#going-to-production-mint-a-token-never-ship-the-key)), a
persistent 401 or 403 points at your token route rather than your key — the SDK re-asks the
route once and replays, so a refusal that survives that is the route answering wrongly. Each
refusal carries a detail string (`Session token has expired.`, `403 origin mismatch`, …); they
are listed with their fixes in the
[SDK troubleshooting table](https://configurator-platform.imagine.io/sdk/index.html#troubleshooting).

### Blank canvas, `instanceof` errors from `three`

Two copies of `three` in the bundle. Add the Vite plugin, which dedupes `three` and `react`
and serves the SDK static assets (Draco decoders, fonts):

```js
// vite.config.js
import imagineConfigurator from '@imagineio/configurator-sdk/vite';
export default defineConfig({ plugins: [react(), imagineConfigurator()] });
```

The same plugin is what stops `404`s on `/assets/draco/…`, which show up as models that never
appear.

### The configurator renders, but with no height

The configurator fills its mount element. Give it a real one:

```css
html, body, #root { height: 100%; margin: 0; }
```

### A blank page for a second or two before the SDK's loading screen

That gap is your own bundle: nothing can paint until the SDK's JS has downloaded and parsed,
and `ui.setLoading()` cannot help because there is no tree to render it into yet. Paint your
own placeholder in `index.html` and remove it once the scene exists. It has to be a
**sibling** of the mount element — React clears that element's children on its first commit:

```html
<div id="boot-splash">Loading…</div>
<div id="root"></div>
```

```js
scene.onReady(() => document.getElementById('boot-splash')?.remove());
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

### A custom component / renderer / strategy silently does nothing

Most registries fail silently by design — a wrong key just means the built-in keeps
rendering. Check what actually registered:

| Registry | Inspect with | Usual mistake |
|---|---|---|
| `ui.registerComponent` | `ui.listComponentOverrides()` | Wrong internal component name |
| `ui.registerButton` | return value is a no-op unregister if ignored | Missing `slot`, or missing both `label` and `icon` |
| `ui.registerLayout` | `ui.listLayouts()`, `ui.activeLayout()` | Replaced `'default'` on a system whose backend selected another shell — register against `ui.activeLayout() ?? 'default'` |
| `ui.registerModal` | `ui.listModals()` | Opening a key you never registered; unknown keys open nothing |
| `scene.registerRenderer` | `scene.listRenderers()` | Wrong key. It is the component's **slot name**, as `scene.listComponents()` reports it (`door_left`, `seat_3`) — case-insensitive, and the catalog component's own kind or name also matches, but the slot is the stable one |
| `placement.registerStrategy` | `placement.listStrategies()` | The object needs an `id` and a `computeLayout` (`computeTargets` is optional) |

In a **custom layout** the cause is usually different: `ui.registerSlot` and `ui.registerModal`
content renders into `parts.SlotHost` and `parts.ModalHost`. A shell that does not mount them
silently drops every such registration.

### The theme does nothing, or looks half-applied

**Cards and dialogs stay white.** You set `colors.background` without `colors.surface` —
`surface` is the raised layer that cards, dialogs and panels read, and it is the token people
miss.

**Nothing changes at all.** Colours go under `config.colors`:

```js
ui.applyTheme({ config: { colors: { primary: '#DD5E27', surface: '#fdfaf2' } } });
```

`ui.applyTheme()` needs no `scene.onReady()` wrapper — it marks the theme host-owned, so the
backend's record yields to it instead of overwriting it during boot. The one thing that still
outranks your call is a `?theme=<id>` URL preview, on purpose.

Every token and what it drives:
[Theme tokens](https://configurator-platform.imagine.io/sdk/index.html#cz-theme).

### `placement.setStrategy()` changes nothing visible

Two causes. A backend-shipped `system.placementStrategy` **wins over** the call, so a system
that ships its own strategy ignores yours. And the call notifies nobody, so even when it does
apply, the change stays invisible until something repaints the scene.

### Placement tiles never appear

Two requirements, and the second catches most people: a product has to be armed
(`products.anchor(…)`, or a palette click), **and** a tile renderer has to be registered with
`placement.registerTargetRenderer` — the SDK ships no tile of its own.

### Pieces overlap or fly apart in a custom strategy

Units. `ctx.getDims()` is **metres** while catalog width is **inches**, and `computeLayout`
rotation is in **radians** while `computeTargets` is in **degrees**.

### Quote template renders blank

The builder receives the real shape from `quote.read()` — `{ lines, totals, … }`, not the
`lineItems` / `total` shape older docs showed.

---

Still stuck? Include your SDK version (`npm ls @imagineio/configurator-sdk`), the system id,
and whether the layout is published — those three answer most questions immediately. For a
runtime failure, send the console output including any `[sdk]` lines: they name the exact URL
or registration that failed.
