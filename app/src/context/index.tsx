import { FC } from 'react'
import { AudioProvider } from './AudioContext'
import { AudioFilesIndexedDBProvider } from './AudioFilesIndexedDBContext'
import { BannerProvider } from './BannerContext'
import { WasmRuntimeProvider } from './WasmRuntimeContext'

export default (function ContextProvider({ children }) {
  return (
    <BannerProvider>
      <WasmRuntimeProvider>
        <AudioFilesIndexedDBProvider>
          <AudioProvider>{children}</AudioProvider>
        </AudioFilesIndexedDBProvider>
      </WasmRuntimeProvider>
    </BannerProvider>
  )
} as FC)
