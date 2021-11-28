import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'lib.ts'),
      name: '.humSynth',
      fileName: format => `lib.${format}.js`,
      formats: ['es'],
    },
  },
})
