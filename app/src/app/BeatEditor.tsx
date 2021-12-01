import { type FC } from 'react'
import AudioEditor from '../components/editor'
import Percussion, { usePercussion } from '../components/Percussion'
import { useBeatAudio } from '../context/AudioContext'

export default (function Beat() {
  const { beatAudioFile, setBeatPlayerAudio, beatFiles, beatInstruments } =
    useBeatAudio()

  const percussion = usePercussion(beatAudioFile)

  const disabled = !beatAudioFile

  return (
    <AudioEditor
      title="Beat"
      storeName="beats"
      playerAudio={beatAudioFile}
      audioFile={beatAudioFile}
      files={beatFiles}
      instruments={beatInstruments}
      fileDeleter={{
        callback: () => setBeatPlayerAudio(null),
      }}
      fileSelector={{ disabled }}
    >
      <Percussion {...percussion} loadDrumsDisabled={disabled} />
    </AudioEditor>
  )
} as FC)
