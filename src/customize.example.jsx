/**
 * Customization cookbook — nothing here runs until you import it from main.jsx:
 *
 *   import './customize.example.jsx';   // BEFORE mount()
 *
 * Every hook below is a registry: you register a replacement, the SDK renders
 * yours instead of its own. None of it needs an SDK release to change.
 *
 * Registries live on namespaces (`ui.*`, `scene.*`, `placement.*`, `quote.*`);
 * only lifecycle, events and hooks are flat exports.
 */
import { ui, scene, placement, quote, parts, setSystemTheme } from '@imagineio/configurator-sdk-staging';

// ── Theme ────────────────────────────────────────────────────────────────────
// Apply the theme from scene.onReady, NOT at module top level: the backend's own
// theme record lands during boot and overwrites anything set before it.
scene.onReady(() => {
  setSystemTheme({
    colors: { primary: '#DD5E27' },
  });
});

// ── Replace one piece of UI ──────────────────────────────────────────────────
// The key is the component name the SDK renders internally; ui.listComponentOverrides()
// shows what you have replaced, ui.hasComponent(name) whether a name is known.
ui.registerComponent('ConfigurationSummary', ({ children }) => (
  <section className="my-summary">{children}</section>
));

// ── Add a button ─────────────────────────────────────────────────────────────
// One config object — `slot` is required, and so is a label or an icon, or the
// call is ignored and returns a no-op unregister function.
ui.registerButton({
  slot: 'toolbar',
  label: 'Help',
  onClick: () => window.open('https://example.com/help'),
});

// ── A modal of your own ──────────────────────────────────────────────────────
// Wrap the content in parts.Modal — registerModal renders your element bare
// otherwise: no backdrop, no escape handling, no positioning.
ui.registerModal('my-dialog', ({ close }) => (
  <parts.Modal title="Send to my cart" onClose={close}>
    <p>Your content here.</p>
  </parts.Modal>
));
// Open it with: ui.openModal('my-dialog')

// ── A whole layout shell ─────────────────────────────────────────────────────
// Read ui.activeLayout() BEFORE registering — replacing 'default' on a system
// that ships its own named layout changes nothing.
// ui.registerLayout('default', MyShell);

// ── A custom 3D renderer for one component ───────────────────────────────────
// The key is the LOWERCASED COMPONENT NAME from your catalog — never the slot
// name. A wrong key fails silently; the built-in renderer just keeps drawing.
// scene.listRenderers() shows what actually registered.
scene.registerRenderer('anne_corner_small', ({ node, ...props }) => (
  <mesh {...props} />
));

// ── A placement strategy ─────────────────────────────────────────────────────
// One object with an `id` and either computeLayout() or mode:'scene-owned'.
// Missing both means the registration is dropped silently — it never throws.
placement.registerStrategy({
  id: 'my-wall-run',
  computeLayout: (pieces, ctx) => pieces.map((piece, i) => ({
    ...piece,
    position: [i * 0.6, 0, 0],
    rotation: [0, 0, 0],
  })),
});
// Switching at runtime: placement.setStrategy('my-wall-run'). Note it notifies
// nobody, so the change is invisible until something repaints the scene.

// ── Your own quote document / PDF ────────────────────────────────────────────
// The builder receives quote.read()'s real shape — { lines, totals, … } — not
// the lineItems/total shape the older docs showed.
quote.registerTemplate('dealer', ({ lines, totals }) => (
  <div className="dealer-quote">
    {lines.map((line) => <div key={line.id}>{line.name}</div>)}
    <strong>{totals.grand}</strong>
  </div>
));
// quote.registerPdf('dealer', dealerPdfBuilder);
