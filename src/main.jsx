import { mount, config } from '@imagineio/configurator-sdk';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Credentials — read from .env.local, never hard-coded.
//    Vite only exposes variables prefixed with VITE_, and only reads env files
//    at startup: edit .env.local, then restart `npm run dev`.
// ─────────────────────────────────────────────────────────────────────────────
const apiKey = import.meta.env.VITE_API_KEY;
const systemId = Number(import.meta.env.VITE_SYSTEM_ID);

if (!apiKey || apiKey === 'ck_replace_me') {
  showSetupHint('Missing VITE_API_KEY. Copy .env.example to .env.local, paste your key from the admin panel → Settings → API Keys, then restart the dev server.');
} else if (!systemId) {
  showSetupHint('Missing VITE_SYSTEM_ID. Set it to the id of the configurable system you want to load, then restart the dev server.');
} else {
  // The backend endpoint is built into the SDK — only the key is yours to set.
  config.setApiKey(apiKey);

  // OPTIONAL — a sales channel selects per-channel prices, hidden options and theme.
  // config.setChannelId('dealer-42');

  // 2. Boot: loads the catalog, builds the scene, renders the full default UI.
  //    systemId is REQUIRED — it names which configurator loads.
  const app = mount('#root', { systemId });

  // Tearing down (e.g. a route change in your own app): app.unmount();
  if (import.meta.hot) import.meta.hot.dispose(() => app.unmount());
}

function showSetupHint(message) {
  document.querySelector('#root').innerHTML = `
    <div style="font:16px/1.6 system-ui,sans-serif;max-width:38rem;margin:20vh auto;padding:0 1.5rem;color:#222">
      <h1 style="font-size:1.25rem;margin:0 0 .5rem">Setup needed</h1>
      <p style="margin:0 0 1rem">${message}</p>
      <p style="margin:0;color:#666;font-size:.9rem">See the README for the full walkthrough.</p>
    </div>`;
}
