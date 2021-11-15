import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src'),
      name: '.humComplementaryChords',
      fileName: format => `index.${format}.js`,
    },
  },
})
