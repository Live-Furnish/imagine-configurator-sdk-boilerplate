# Customizing the configurator

`mount()` renders the full default UI. Everything visible is replaceable through a registry:
you register a replacement, the SDK renders yours instead of its own. None of it needs an SDK
release.

[`src/customize.example.jsx`](../src/customize.example.jsx) is the runnable version of this
page. Import it from `main.jsx` **before** `mount()` and watch each registry take effect:

```jsx
import './customize.example.jsx';   // BEFORE mount()
```

Registries live on namespaces — `ui.*`, `scene.*`, `placement.*`, `quote.*`. Only lifecycle,
events and hooks are flat exports.

```js
import { ui, scene, placement, quote, parts }
  from '@imagineio/configurator-sdk-staging';
```

> **Most of these fail silently by design.** A wrong key means the built-in keeps rendering —
> no throw, no warning. Each section below names the inspector that tells you what actually
> registered. Use it; it is faster than guessing.

---

## Theme

```js
ui.applyTheme({ config: { colors: { primary: '#DD5E27' } } });
```

**Module top level is the right place — no `scene.onReady()` needed.** `ui.applyTheme` is the
host's entry point: calling it marks the theme host-owned, and the backend's own theme record
yields to it from then on. (A `?theme=` preview in the URL still wins, deliberately.)

**Colours go under `config.colors`**, with `colorTokens` as the fallback spelling. A bare
`{ colors: … }` is read by nothing — the call succeeds and the palette does not change, which
is the single most common customization bug.

If a theme names a Google font, the SDK fetches it from `fonts.googleapis.com` — allow that
in your CSP or use a self-hosted family.

## Replace one piece of UI

```jsx
ui.registerComponent('ConfigurationSummary', ({ children }) => (
  <section className="my-summary">{children}</section>
));
```

The key is the component name the SDK renders internally.

- `ui.listComponentOverrides()` — what you have replaced
- `ui.hasComponent(name)` — whether a name is known at all

Check `hasComponent` first. A typo registers happily and renders nothing.

## Add a button

```jsx
ui.registerButton({
  slot: 'toolbar',
  label: 'Help',
  onClick: () => window.open('https://example.com/help'),
});
```

One config object. `slot` is required, and so is **either** `label` or `icon` — otherwise the
call is ignored and returns a no-op unregister function. The return value is your only signal
that it worked.

## Your own modal

```jsx
ui.registerModal('my-dialog', ({ close }) => (
  <parts.Modal title="Send to my cart" onClose={close}>
    <p>Your content here.</p>
  </parts.Modal>
));

ui.openModal('my-dialog');
```

**Wrap the content in `parts.Modal`.** `registerModal` renders your element bare otherwise —
no backdrop, no escape handling, no positioning.

## A whole layout shell

```jsx
ui.registerLayout('default', MyShell);
```

**Read `ui.activeLayout()` before you register.** Replacing `'default'` on a system that
ships its own named layout changes nothing, and there is no error to tell you so.

## Custom 3D for one component

```jsx
scene.registerRenderer('anne_corner_small', ({ node, ...props }) => (
  <mesh {...props} />
));
```

The key is the **lowercased component name** from your catalog — never the slot name. A wrong
key fails silently and the built-in renderer keeps drawing. `scene.listRenderers()` shows what
actually registered.

## Placement strategy

```jsx
placement.registerStrategy({
  id: 'my-wall-run',
  computeLayout: (pieces, ctx) => pieces.map((piece, i) => ({
    ...piece,
    position: [i * 0.6, 0, 0],
    rotation: [0, 0, 0],
  })),
});

placement.setStrategy('my-wall-run');
```

The object needs an `id` and **either** `computeLayout()` **or** `mode: 'scene-owned'`.
Missing both means the registration is dropped silently — it never throws.

`setStrategy()` notifies nobody, so the switch is invisible until something repaints the
scene.

Note the division of labour: the flat import format creates catalog *primitives*, while
chaining, seam rules and auto-alignment are placement-engine behaviour. A custom strategy is
where that logic goes if the built-ins do not fit. See
[import-sample-catalog.md](import-sample-catalog.md#after-the-import-what-the-flat-format-cannot-carry).

## Quote document and PDF

```jsx
quote.registerTemplate('dealer', ({ lines, totals }) => (
  <div className="dealer-quote">
    {lines.map((line) => <div key={line.id}>{line.name}</div>)}
    <strong>{totals.grand}</strong>
  </div>
));

quote.registerPdf('dealer', dealerPdfBuilder);
```

The builder receives the real shape from `quote.read()` — `{ lines, totals, … }`. Older docs
showed `lineItems` / `total`; that shape is gone, and using it renders a blank document.

---

## Quick reference

| What you want | How | Inspect with |
|---|---|---|
| Brand colours, fonts | `ui.applyTheme({ config: { colors } })` before `mount()` | — |
| Replace one component | `ui.registerComponent(name, Component)` | `ui.listComponentOverrides()`, `ui.hasComponent()` |
| Add a button | `ui.registerButton({ slot, label, onClick })` | return value (no-op if ignored) |
| Your own modal | `ui.registerModal(key, Component)` + `parts.Modal` | — |
| Whole layout shell | `ui.registerLayout('default', Shell)` | `ui.activeLayout()` |
| Custom 3D for a part | `scene.registerRenderer(componentName, Renderer)` | `scene.listRenderers()` |
| Custom placement logic | `placement.registerStrategy({ id, computeLayout })` | — |
| Your own quote / PDF | `quote.registerTemplate(key, Doc)`, `quote.registerPdf(key, builder)` | — |

## Other knobs

Not registries, but worth knowing:

```js
config.setApiKey(apiKey);
config.setChannelId('dealer-42');   // per-channel prices, hidden options, theme

const app = mount('#root', { systemId });
app.unmount();                       // e.g. on a route change
```

A **sales channel** selects per-channel prices, hidden options and theme — the cleanest way
to serve dealer and retail pricing from one catalog.

When a registry silently does nothing:
[troubleshooting.md — Runtime](troubleshooting.md#runtime).
