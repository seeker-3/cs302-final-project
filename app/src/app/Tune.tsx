import { pianoSynth } from '@dothum/synth'
import { useEffect, useState, type FC } from 'react'
import Editor from '../components/editor'
import { useTuneAudio } from '../context/AudioContext'

export default (function Tune() {
  const { tunePlayerAudio, setTunePlayerAudio, tuneFiles, tuneInstruments } =
    useTuneAudio()

  const [loading, setLoading] = useState(false)

  const instrument = tuneInstruments.selected
  const { file: audioFile = null, notes = null } = tuneFiles.selected ?? {}

  useEffect(() => {
    void (async () => {
      if (!instrument || !audioFile) return
      if (!notes) throw Error('tune was not saved properly')
      console.log(instrument)
      switch (instrument) {
        case 'original':
          setTunePlayerAudio(audioFile)
          return
        case 'piano':
          setLoading(true)
          setTunePlayerAudio(await pianoSynth(notes))
          setLoading(false)
          return
        default:
          throw Error(`unrecognized instrument: ${instrument}`)
      }
    })().catch(console.error)
  }, [instrument, audioFile, notes, setTunePlayerAudio])

  return (
    <Editor
      title="Tune"
      storeName="tunes"
      playerAudio={tunePlayerAudio}
      audioFile={audioFile}
      files={tuneFiles}
      instruments={tuneInstruments}
      fileProcessor={{
        disabled: loading,
        // handler: handleProcess,
      }}
      fileSelector={{
        disabled: loading,
      }}
      fileDeleter={{
        disabled: loading,
        callback: () => setTunePlayerAudio(null),
      }}
      instrumentSelector={{
        disabled: loading,
      }}
      // render={props => <PitchFinder {...props} />}
    >
      {notes && (
        <ul className="row">
          notes:
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </Editor>
  )
} as FC)
