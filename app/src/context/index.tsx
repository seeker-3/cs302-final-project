import { FC } from 'react'
import { AudioFilesProvider } from './AudioFilesContext'
import { MediaDeviceProvider } from './MediaDeviceContext'
import { WasmRuntimeProvider } from './WasmRuntimeContext'

export default (function ContextProvider({ children }) {
  return (
    <MediaDeviceProvider>
      <AudioFilesProvider>
        <WasmRuntimeProvider>{children}</WasmRuntimeProvider>
      </AudioFilesProvider>
    </MediaDeviceProvider>
  )
} as FC)
