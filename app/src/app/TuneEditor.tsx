import { pianoSynth } from '@dothum/synth'
import { useEffect, useState, type FC } from 'react'
import AudioEditor from '../components/editor'
import { useTuneAudio } from '../context/AudioContext'

export default (function Tune() {
  const { tunePlayerAudio, setTunePlayerAudio, tuneFiles, tuneInstruments } =
    useTuneAudio()
  const instrument = tuneInstruments.selected

  // disables buttons during certain actions
  const [loading, setLoading] = useState(false)

  const { file: audioFile = null, notes = null } = tuneFiles.selected ?? {}

  const isOriginalAudio = instrument === 'original'

  // if original audio set the audioPlayer track right away
  useEffect(() => {
    if (audioFile) setTunePlayerAudio(isOriginalAudio ? audioFile : null)
  }, [isOriginalAudio, audioFile, setTunePlayerAudio])

  const processHandler = async () => {
    if (!instrument || !audioFile) return
    if (!notes) throw Error('tune was not saved to indexedDB properly')
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
    <AudioEditor
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
    </AudioEditor>
  )
} as FC)
