const { resolve } = require('node:path')

module.exports = function override(config) {
  const wasmExtensionRegExp = /\.wasm$/

  config.resolve.extensions.push('.wasm')

  for (const { oneOf = [] } of config.module.rules) {
    for (const { loader = null, exclude } of oneOf) {
      if (loader?.indexOf('file-loader') >= 0) exclude.push(wasmExtensionRegExp)
    }
  }

  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: resolve(__dirname, 'src'),
    use: [{ loader: 'wasm-loader' }],
  })

  return config
}

// import { resolve } from 'node:path'

// export default function override(config) {
//   const wasmExtensionRegExp = /\.wasm$/

//   config.resolve.extensions.push('.wasm')

//   for (const { oneOf = [] } of config.module.rules) {
//     for (const { loader = null, exclude } of oneOf) {
//       if (loader?.indexOf('file-loader') >= 0) exclude.push(wasmExtensionRegExp)
//     }
//   }

//   // add a dedicated loader for WASM
//   config.module.rules.push({
//     test: wasmExtensionRegExp,
//     include: resolve(__dirname, 'src'),
//     use: [{ loader: 'wasm-loader' }],
//   })

//   return config
// }
