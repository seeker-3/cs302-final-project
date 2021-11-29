import { convertBufferToNotes, Notes } from '@dothum/pitch-finder'
import { PianoSynth } from '@dothum/synth'
import { FC, useState } from 'react'

const wait = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

export default (function ({ audioFile }) {
  const [notes, setNotes] = useState<Notes[] | null>([
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'A4',
    'B4',
    'C5',
  ])
  const [loading, setLoading] = useState(false)

  return (
    <div className="column">
      <div className="row">
        <button
          className="width2"
          onClick={async () => {
            if (!audioFile) return
            setLoading(true)
            await wait(0)
            const notes = await convertBufferToNotes(
              await audioFile.arrayBuffer()
            )
            setNotes(notes)
            setLoading(false)
          }}
          disabled={!audioFile || loading}
        >
          {loading ? 'loading...' : 'get notes'}
        </button>
        <button
          className="width2"
          disabled={!notes}
          onClick={async () => {
            if (!notes) return
            const blob = await PianoSynth(notes)
            console.log(blob)
          }}
        >
          play synth
        </button>
      </div>
      {notes && (
        <ul className="row">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  )
} as FC<{
  audioFile: File | null
}>)
