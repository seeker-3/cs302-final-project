import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src'),
      name: '.humPercussion',
      fileName: format => `index.${format}.js`,
    },
  },
})
