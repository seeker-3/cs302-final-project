import { convertBufferToNotes, Notes } from '@dothum/pitch-finder'
import { pianoSynth } from '@dothum/synth'
import { FC, useState } from 'react'
import Editor from '../components/editor'
import { useTuneAudio } from '../context/AudioContext'

export default (function Tune() {
  const { tunePlayerAudio, setTunePlayerAudio, tuneFiles, tuneInstruments } =
    useTuneAudio()

  const [notes, setNotes] = useState<Notes[] | null>(null)
  const [loading, setLoading] = useState(false)

  const selectedInstrument = tuneInstruments.selected
  const selectedFile = tuneFiles.selected

  const handleProcess = async () => {
    if (!selectedInstrument || !selectedFile) return
    switch (selectedInstrument) {
      case 'original':
        setTunePlayerAudio(selectedFile)
        return
      case 'piano': {
        if (notes) return setTunePlayerAudio(await pianoSynth(notes))
        setLoading(true)
        const processedNotes = await convertBufferToNotes(
          await selectedFile.arrayBuffer()
        )
        setTunePlayerAudio(await pianoSynth(processedNotes))
        setNotes(processedNotes)
        setLoading(false)

        return
      }
      default:
        throw Error(`unrecognized instrument: ${selectedInstrument}`)
    }
  }

  // useEffect(() => {
  //   void (async () => {
  //     if (!selectedInstrument || !selectedFile) return
  //     switch (selectedInstrument) {
  //       case 'original':
  //         setTunePlayerAudio(selectedFile)
  //         return
  //       case 'piano':
  //         setTunePlayerAudio(
  //           await pianoSynth(
  //             await convertBufferToNotes(await selectedFile.arrayBuffer())
  //           )
  //         )
  //         return
  //       default:
  //         throw Error(`unrecognized instrument: ${selectedInstrument}`)
  //     }
  //   })().catch(console.error)
  // }, [selectedInstrument, selectedFile, setTunePlayerAudio])

  return (
    <Editor
      title="Tune"
      storeName="tunes"
      playerAudio={tunePlayerAudio}
      files={tuneFiles}
      instruments={tuneInstruments}
      handleProcess={handleProcess}
      processorDisabled={loading}
      // render={props => <PitchFinder {...props} />}
    >
      {(loading && 'generating notes...') ||
        (notes && (
          <ul className="row">
            notes:
            {notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        ))}
    </Editor>
  )
} as FC)
