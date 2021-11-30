import { type FC } from 'react'
import Editor from '../components/editor'
import Percussion, { usePercussion } from '../components/Percussion'
import { useBeatAudio } from '../context/AudioContext'

export default (function Beat() {
  const {
    instrumentIndex,
    beatAudioFile,
    setBeatPlayerAudio,
    beatFiles,
    beatInstruments,
  } = useBeatAudio()

  const percussion = usePercussion(beatAudioFile, instrumentIndex)

  const disabled = !beatAudioFile

  return (
    <Editor
      title="Beat"
      storeName="beats"
      playerAudio={beatAudioFile}
      audioFile={beatAudioFile}
      files={beatFiles}
      instruments={beatInstruments}
      fileDeleter={{
        callback: () => setBeatPlayerAudio(null),
      }}
      fileProcessor={{
        disabled,
        handler: percussion.loadDrum,
      }}
    >
      <Percussion {...percussion} />
    </Editor>
  )
} as FC)
