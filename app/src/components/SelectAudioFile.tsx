import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import useIndexedDB from './IndexedDBContext'

export default (function AudioFiles() {
  const db = useIndexedDB()
  const [audioFiles, setAudioFiles] = useState<File[] | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const audioFiles = await db.getAll('audio-files')
      setAudioFiles(audioFiles)
    })().catch(console.error)
  }, [setAudioFiles])

  if (!audioFiles) return null

  const handleChange: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    setSelected(target.value)
  }

  return (
    <select name="audio-files" onChange={handleChange}>
      {audioFiles.map(audioFile => {
        return (
          <option key={audioFile.name} value={audioFile.name}>
            {audioFile.name}
          </option>
        )
      })}
    </select>
  )
} as FC)

const audioContext = new AudioContext()
