import { FC } from 'react'
import { BannerProvider } from './BannerContext'
import { AudioFilesProvider } from './AudioFilesContext'
import { WasmRuntimeProvider } from './WasmRuntimeContext'

export default (function ContextProvider({ children }) {
  return (
    <WasmRuntimeProvider>
      <AudioFilesProvider>
        <BannerProvider>{children}</BannerProvider>
      </AudioFilesProvider>
    </WasmRuntimeProvider>
  )
} as FC)
