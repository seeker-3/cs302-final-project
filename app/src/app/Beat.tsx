import { useEffect, type FC } from 'react'
import Editor from '../components/editor'
import Percussion from '../components/Percussion'
import { useBeatAudio } from '../context/AudioContext'

export default (function Beat() {
  const { beatPlayerAudio, setBeatPlayerAudio, beatFiles, beatInstruments } =
    useBeatAudio()

  const selectedInstrument = beatInstruments.selected
  const audioFile = beatFiles.selected?.file ?? null

  useEffect(() => {
    if (!selectedInstrument || !audioFile) return
    void (async () => {
      switch (selectedInstrument) {
        case 'original':
          setBeatPlayerAudio(audioFile)
          return
        case 'piano':
          return
        default:
          throw Error(`unrecognized instrument: ${selectedInstrument}`)
      }
    })().catch(console.error)
  }, [selectedInstrument, audioFile, setBeatPlayerAudio])

  return (
    <Editor
      title="Beat"
      storeName="beats"
      playerAudio={beatPlayerAudio}
      audioFile={audioFile}
      files={beatFiles}
      instruments={beatInstruments}
      fileDeleter={{
        callback: () => setBeatPlayerAudio(null),
      }}
      fileProcessor={{
        handler: () => alert('analyze this'),
      }}
      render={props => <Percussion {...props} />}
    />
  )
} as FC)
