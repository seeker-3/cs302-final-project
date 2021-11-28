import { convertBufferToNotes, Notes } from '@dothum/pitch-finder'
import { FC, useState } from 'react'

export default (function ({ audioFile }) {
  const [notes, setNotes] = useState<Notes[] | null>(null)

  return (
    <div className="row">
      <button
        className="width2"
        onClick={async () => {
          if (!audioFile) return
          const notes = await convertBufferToNotes(
            await audioFile.arrayBuffer()
          )
          setNotes(notes)
        }}
        disabled={!audioFile}
      >
        get notes
      </button>
      {notes && (
        <ul className="row">
          {notes.map((note, i) => (
            <li key={i}>
              <p>note: {note}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} as FC<{
  audioFile: File | null
}>)
