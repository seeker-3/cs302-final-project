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

  const isOriginalAudio = instrument === 'original'

  useEffect(() => {
    if (!audioFile) return
    setTunePlayerAudio(isOriginalAudio ? audioFile : null)
  }, [isOriginalAudio, audioFile, setTunePlayerAudio])

  const processHandler = async () => {
    if (!instrument || !audioFile) return
    if (!notes) throw Error('tune was not saved properly')
    setTunePlayerAudio(null)
    switch (instrument) {
      case 'piano':
        setLoading(true)
        setTunePlayerAudio(await pianoSynth(notes))
        setLoading(false)
        return
      default:
        throw Error(`unrecognized instrument: ${instrument}`)
    }
  }

  return (
    <Editor
      title="Tune"
      storeName="tunes"
      playerAudio={tunePlayerAudio}
      audioFile={audioFile}
      files={tuneFiles}
      instruments={tuneInstruments}
      fileProcessor={{
        disabled: loading || !!tunePlayerAudio,
        handler: processHandler,
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
