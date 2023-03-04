/* eslint-disable camelcase */
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const pwaOptions: Partial<VitePWAOptions | ManifestOptions> = {
  registerType: 'autoUpdate',
  categories: ['education', 'utilities'],
  description:
    'A translator app that uses OpenAI GPT-3 to translate between languages. It is a PWA that can be installed on your phone or desktop.',
  manifest: {
    short_name: 'OpenAI Translator',
    name: 'OpenAI Translator',
    display: 'standalone',
    icons: [
      {
        src: 'icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        src: 'icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        src: 'icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    start_url: '/',
    theme_color: '#047AFF',
    background_color: '#047AFF',
  },
  includeAssets: ['openai-translator-apple-touch-icon.png', 'favicon.png', 'locales/**/*.json', 'icons/*.{png,svg}'],
};

// https://vitejs.dev/config/

// local mode: development | test
// publishing mode: pre | prod

export default async function ({ command, mode }: ConfigEnv): Promise<UserConfig> {
  const env = loadEnv(mode, __dirname);

  return {
    server: {
      open: true,
    },
    base: env['VITE_PUBLIC_PATH'],
    root: resolve(__dirname, 'src'),
    build: {
      // Specified by the relative path from root (= ./)
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [react(), svgr(), VitePWA(pwaOptions)],
    resolve: {
      alias: {
        '@/': `${__dirname}/src/`,
      },
    },
    assetsInclude: ['favicon.png', 'openai-translator-apple-touch-icon.png', 'locales/**/*.json', 'icons/*.{png,svg}'],
  };
}
