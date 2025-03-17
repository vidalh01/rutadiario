import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/rutadiario/', // ✅ Asegura que todo esté en la subcarpeta correcta
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ruta Diario',
        short_name: 'RutaDiario',
        start_url: '/rutadiario/',
        scope: '/rutadiario/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b983',
        icons: [
          {
            src: '/rutadiario/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/rutadiario/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        navigateFallback: '/rutadiario/index.html', // ✅ Redirección correcta en GitHub Pages
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
