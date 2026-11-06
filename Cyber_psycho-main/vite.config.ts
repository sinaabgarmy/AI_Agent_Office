import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy /api requests to the Express backend. Only relevant when running
      // `vite dev` standalone; `npm run dev` (tsx server.ts) already serves the
      // API from the same origin, where this setting is simply ignored.
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.PORT || 3000}`,
          changeOrigin: false,
        },
      },
    },
  };
});
