import { FC, useEffect } from 'react'
import Editor from '../components/editor'
import Percussion from '../components/Percussion'
import { useBeatAudio } from '../context/AudioContext'

export default (function Beat() {
  const { beatPlayerAudio, setBeatPlayerAudio, beatFiles, beatInstruments } =
    useBeatAudio()

  const selectedInstrument = beatInstruments.selected
  const selectedFile = beatFiles.selected

  useEffect(() => {
    if (!selectedInstrument || !selectedFile) return
    void (async () => {
      switch (selectedInstrument) {
        case 'original':
          setBeatPlayerAudio(selectedFile)
          return
        case 'piano':
          return
        default:
          throw Error(`unrecognized instrument: ${selectedInstrument}`)
      }
    })().catch(console.error)
  }, [selectedInstrument, selectedFile, setBeatPlayerAudio])

  return (
    <Editor
      title="Beat"
      storeName="beats"
      playerAudio={beatPlayerAudio}
      files={beatFiles}
      instruments={beatInstruments}
      handleProcess={() => alert('analyze this')}
      render={props => <Percussion {...props} />}
    />
  )
} as FC)
