import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import imagineConfigurator from '@imagineio/configurator-sdk/vite';

// The imagineConfigurator() plugin serves the SDK's static assets (Draco decoders,
// fonts) and dedupes three/react so exactly one copy of each ends up in the bundle.
// Without it you get a blank canvas and an "instanceof" failure from three.
export default defineConfig({
  plugins: [react(), imagineConfigurator()],
});
