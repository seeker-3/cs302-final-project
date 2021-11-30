import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import wasmPack from 'vite-plugin-wasm-pack'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        sourcemap: true,
      },
    }),
    wasmPack([], '@dothum/wasm'),
  ],
})
