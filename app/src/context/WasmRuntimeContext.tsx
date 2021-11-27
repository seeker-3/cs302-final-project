import init, { InitOutput } from '@dothum/wasm'
import createAsyncContext from './createAsyncContext'

const [WasmRuntimeProvider, useWasmRuntime] =
  createAsyncContext<InitOutput>(init)

export { WasmRuntimeProvider }
export default useWasmRuntime
