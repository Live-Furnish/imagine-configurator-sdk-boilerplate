# imagine.io Configurator SDK — Boilerplate

A starter app for the **imagine.io Configurator SDK**: a 3D product configurator with live
pricing, save/share, AR, and AI-generated imagery, driven entirely by a catalog you set up
in the admin panel. Install the package, add your API key, call `mount()` once — that is
the whole integration.

This repo gives you the working app, the steps to get from zero to a configurator running on
your own data, and the slots where sample catalogs for a **sectional sofa** and a **kitchen**
will land (placeholders today — see [Sample catalogs](#sample-catalogs)).

> **Licence:** non-commercial use only until you hold a paid subscription, and the sample
> 3D assets are non-commercial **forever**, subscription or not. See [LICENSE.md](LICENSE.md)
> and [data-samples/LICENSE-ASSETS.md](data-samples/LICENSE-ASSETS.md) before you ship anything.

---

## Quick start

```bash
git clone https://github.com/pnkj1002/imagine-configurator-sdk-boilerplate.git
cd imagine-configurator-sdk-boilerplate
npm install
cp .env.example .env.local      # then paste your API key into it
npm run dev
```

Open http://localhost:5173. If the key is missing the page says so instead of rendering an
empty canvas.

Four things must be true before anything appears: you have an account, your org has a
catalog, you have an API key, and you know your system id. The rest of this page is those
four things in order.

---

## 1. Sign up

Create an organisation and an owner account at **https://admin-configurator-stag.imagine.io**.
Sign-up takes an organisation name, an email and a password (8 characters minimum); the
first user is the org owner and can invite the rest of the team.

One account = one organisation = one catalog. Everything you create below — products,
materials, options, systems — belongs to that org, and an API key only ever sees its own
org's data.

## 2. Build (or import) a catalog

**The configurator renders nothing until your organisation has a catalog.** There is no
built-in demo data: a valid key pointed at an empty org gives you an empty scene.

The fastest path, once the sample bundles are published, is to import one: **extract** the
zip, drop the extracted folder on the importer, then publish the layout:

→ **[docs/import-sample-catalog.md](docs/import-sample-catalog.md)**

The long way round, for your own products, is the admin panel in this order: materials →
components → product graphs and variants → option sets and options → a configurable system
that ties them together. The admin documentation walks through each step.

## 3. Create an API key

In the admin panel: **Settings → API Keys → Create key**.

**Copy it immediately.** The full key is returned only in the response that creates it —
every later read shows it masked as `ck_…abcd` (last four characters), so a key you did not
copy cannot be recovered. Create a replacement and revoke the old one.

**Choose the scope deliberately**, because it is enforced by the platform, not by your code:

| Scope | Key looks like | What it can do |
|---|---|---|
| **Read & write** | `ck_…` | Everything — catalog, pricing, **and saving projects / uploading renders**. Use this one for the boilerplate. |
| Read only | `ck_ro_…` | Catalog, evaluate and pricing only. **Cannot save projects**, and cannot mint a read-write session token. |

The configurator loads and renders fine on a read-only key — the failure only shows up later,
when save/share does nothing. If that is what you are seeing, check the prefix on your key.

Keys are per-organisation and you can hold several, so give each consumer its own
(storefront, mobile, this boilerplate) and revoke them independently. Scope stays editable
after creation: flipping a leaked key to read-only defangs it without breaking read traffic.

Then put it in `.env.local` (never in source, never in git):

```bash
VITE_API_KEY=ck_your_real_key_here
VITE_SYSTEM_ID=2
```

`VITE_SYSTEM_ID` names **which** configurator loads — find it in the admin panel under
Configurable Systems, in the URL of the system you want (`…/configurable-systems/2` → `2`).
Without it, nothing mounts.

Vite reads env files **at startup only**. Edit `.env.local`, then restart `npm run dev`.

## 4. Mount it

That is all of [src/main.jsx](src/main.jsx):

```jsx
import { mount, config } from '@imagineio/configurator-sdk-staging';

config.setApiKey(import.meta.env.VITE_API_KEY);
const app = mount('#root', { systemId: Number(import.meta.env.VITE_SYSTEM_ID) });
// later: app.unmount();
```

The backend endpoint is compiled into the SDK — only the key and the system id are yours to
set. `mount()` loads the catalog, builds the scene and renders the full default UI.

---

## Installing the SDK in your own app

If you would rather start from your own project than this one:

```bash
npm create vite@latest my-configurator -- --template react --yes
cd my-configurator
npm install @imagineio/configurator-sdk-staging@beta react@^18.2 react-dom@^18.2
npm install -D @types/react@^18.3 @types/react-dom@^18.3
```

Three details that are easy to get wrong, and what each one costs you:

- **Always install with `@beta`.** This is the staging package and current builds publish
  under the `beta` dist-tag. `latest` is **not** kept in step — at the time of writing it
  points at `0.1.0-beta.12` while `beta` is `0.1.0-beta.14` — so installing without the
  tag does not fail, it silently gives you an older build. Check with
  `npm view @imagineio/configurator-sdk-staging dist-tags`.
- **Pin React 18.** A fresh Vite template scaffolds React 19, which the SDK's 3D stack does
  not support (`@react-three/fiber@8` needs React 18). Skip the pin and the install dies
  with `ERESOLVE`.
- **Pin the React *types* too**, even in a plain JavaScript project. create-vite scaffolds
  React 19 types; pinning only the runtime leaves them mismatched — no error, just wrong
  autocomplete everywhere.

Then add the Vite plugin, which serves the SDK's static assets and dedupes `three`/`react`
so exactly one copy of each ends up in your bundle:

```js
// vite.config.js
import imagineConfigurator from '@imagineio/configurator-sdk-staging/vite';
export default defineConfig({ plugins: [react(), imagineConfigurator()] });
```

**Prefer a shorter import name?** npm can alias the package at install time, so moving to
the production package later is a one-line change in `package.json` instead of a
find-and-replace across your code:

```bash
npm install "@imagineio/configurator-sdk@npm:@imagineio/configurator-sdk-staging@beta"
```

---

## Making it yours

[src/customize.example.jsx](src/customize.example.jsx) is a runnable cookbook of the
registries — import it from `main.jsx` (before `mount()`) to watch each one take effect:

| What you want | How |
|---|---|
| Brand colours, fonts | `setSystemTheme({ colors })` inside `scene.onReady()` |
| Replace one component | `ui.registerComponent(name, Component)` |
| Add a button | `ui.registerButton({ slot, label, onClick })` |
| Your own modal | `ui.registerModal(key, Component)` + `parts.Modal` |
| Whole layout shell | `ui.registerLayout('default', Shell)` |
| Custom 3D for a part | `scene.registerRenderer(componentName, Renderer)` |
| Custom placement logic | `placement.registerStrategy({ id, computeLayout })` |
| Your own quote / PDF | `quote.registerTemplate(key, Doc)`, `quote.registerPdf(key, builder)` |

Full notes and the trap in each: **[docs/customizing.md](docs/customizing.md)**.

## Sample catalogs

**`sectional-sofa-import.zip`** — the Anne modular sofa. What the bundle will contain:

| | |
|---|---|
| **Catalog** | 51 components, 15 product variants, 7 option sets, 19 materials, 41 options, 2 layout presets, 7 rules, 4 constraints |
| **Assets** | 51 GLB models, 221 textures, 20 thumbnails, 1 studio HDRI |
| **Size** | ~87 MB zipped (295 files) |
| **Status** | **Not published yet** — [`data-samples/sectional-sofa-import.zip`](data-samples/sectional-sofa-import.zip) is a placeholder |

A second bundle, **kitchen** (327 components, 76 variants, 15 option sets), is also on the
way: [`data-samples/kitchen-import.zip`](data-samples/kitchen-import.zip), likewise a
placeholder for now.

Both archives currently hold only a README describing what will land in them. Until the real
assets ship, build your catalog in the admin panel by hand — see step 2 above.

The import mechanics will not change when they do: extract the zip, then drop the **extracted
folder** on the importer (the wrapping folder inside means the zip itself cannot be uploaded).

Full walkthrough: [docs/import-sample-catalog.md](docs/import-sample-catalog.md).
Field-by-field schema notes: [data-samples/sectional-sofa-import/CATALOG.md](data-samples/sectional-sofa-import/CATALOG.md).

## Requirements

Node ≥ 18, React 18, Vite. Peer deps (`three` 0.159, `@react-three/fiber` 8,
`@react-three/drei` 9) are installed automatically by npm 7+.

**Strict CSP?** Two things load at runtime from Google rather than from the package: the AR
viewer script (`https://ajax.googleapis.com`, override with `VITE_MODEL_VIEWER_SRC` to
self-host) and theme fonts (`https://fonts.googleapis.com`, `https://fonts.gstatic.com`,
only when a theme names a Google font). Allow those in `script-src` / `style-src` /
`font-src`, or point the override at your own origin.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Blank page, "Setup needed" | `VITE_API_KEY` or `VITE_SYSTEM_ID` missing from `.env.local` — or you edited it without restarting the dev server |
| 401 on every request | Wrong or revoked API key |
| Loads fine, but save/share does nothing | Read-only key (`ck_ro_…`) — create a read & write key |
| Empty scene, no errors | Valid key, but the org has no catalog, or `systemId` names a system whose layout was never published |
| Imported the sample, still empty | The layout is still a draft — publish it from the system's **Layouts** tab |
| Importer can't find `catalog.xlsx` | You uploaded the zip instead of the extracted folder |
| `ERESOLVE` on install | React 19 in the project — pin React 18 (see above) |
| SDK behaves like an older build | You installed without `@beta` and got `latest`, which lags behind |
| Blank canvas, `three` `instanceof` errors | Two copies of `three` — add the `imagineConfigurator()` Vite plugin |

More: **[docs/troubleshooting.md](docs/troubleshooting.md)**.

## Licence

Non-commercial until you hold a paid subscription — [LICENSE.md](LICENSE.md). Sample assets
stay non-commercial permanently — [data-samples/LICENSE-ASSETS.md](data-samples/LICENSE-ASSETS.md).
Licensing enquiries: legal@imagine.io.
