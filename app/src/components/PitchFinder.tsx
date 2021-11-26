import { convertBufferToNotes, Notes } from '@dothum/pitch-finder'
import { FC, useEffect, useState } from 'react'

export default (function ({ buffer }) {
  const [notes, setNotes] = useState<Notes[] | null>(null)
  useEffect(() => {
    void (async () => {
      const notes = await convertBufferToNotes(buffer)
      setNotes(notes)
    })().catch(console.error)
  }, [buffer, setNotes])

  if (!notes) return
  return (
    <ul>
      {notes.map(({ note, side, cent }, i) => (
        <li key={i}>
          <p>note:</p>
          <p>{note}</p>
          <p>{side}</p>
          <p>{cent}</p>
        </li>
      ))}
    </ul>
  )
} as FC<{ buffer: ArrayBuffer }>)
