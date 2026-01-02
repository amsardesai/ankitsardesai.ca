import stylexPlugin from '@stylexjs/unplugin';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    stylexPlugin.vite({
      dev: mode !== 'production',
      unstable_moduleResolution: { type: 'commonJS', rootDir: __dirname },
    }),
    react(),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  build: {
    manifest: true,
    outDir: 'build/client',
    rollupOptions: {
      input: resolve(__dirname, 'app/client.tsx'),
    },
  },

  server: {
    // In dev, assets are served from the same port via Vite middleware
  },

  ssr: {
    external: ['sqlite3', 'express', 'serve-favicon'],
  },
}));
