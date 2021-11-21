import complementaryChords from '@dothum/complementary-chords'
import { convertBufferToNotes } from '@dothum/pitch-finder'
import { StrictMode } from 'react'
import { render } from 'react-dom'
import { registerSW } from 'virtual:pwa-register'
import Percussion from './components/Percussion'
import { AudioFilesProvider } from './context/IndexedDBContext'

convertBufferToNotes
complementaryChords

render(
  <StrictMode>
    {/* <WasmRuntimeProvider> */}
    <AudioFilesProvider>
      {/* <RecordAudio /> */}
      <Percussion />
    </AudioFilesProvider>
    {/* </WasmRuntimeProvider> */}
  </StrictMode>,
  document.getElementById('root'),
)

registerSW()
