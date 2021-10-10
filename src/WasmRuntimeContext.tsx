import { createContext, FC, useContext, useEffect, useState } from 'react'

type WasmRuntime = typeof import('@dothum/wasm') // alias
type WasmRuntimeOrNull = WasmRuntime | null

const WasmRuntimeContext = createContext<WasmRuntimeOrNull>(null)

export const WasmRuntimeProvider: FC = ({ children }) => {
  const [wasmRuntime, setWasmRuntime] = useState<WasmRuntimeOrNull>(null)

  useEffect(() => {
    void (async () => {
      const wasmModule = await import('@dothum/wasm')
      setWasmRuntime(wasmModule)
    })().catch(console.error)
  })

  if (!wasmRuntime) return null

  return (
    <WasmRuntimeContext.Provider value={wasmRuntime}>
      {children}
    </WasmRuntimeContext.Provider>
  )
}

export default function useWasmRuntime(): WasmRuntime {
  const wasmRuntime = useContext(WasmRuntimeContext)
  if (!wasmRuntime)
    throw Error('useWasmRuntime: wasm runtime did not load properly')
  return wasmRuntime
}
