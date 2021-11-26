import init, { InitOutput } from '@dothum/wasm'
import createAsyncContext from './createAsyncContext'

type WasmRuntime = InitOutput

const [WasmRuntimeProvider, useWasmRuntime] =
  createAsyncContext<WasmRuntime>(init)

export { WasmRuntimeProvider }
export default useWasmRuntime
