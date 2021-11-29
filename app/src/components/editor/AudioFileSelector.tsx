import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import useAudioFiles from '../../context/AudioFilesContext'
import { AudioFileStores } from '../../db/indexedDB'

export const useAudioFileSelector = (storeName: AudioFileStores) => {
  const { [storeName]: audioFiles } = useAudioFiles()
  const [audioFile, setAudioFile] = useState<File | null>(null)

  useEffect(() => {
    setAudioFile(audioFiles[0] ?? null)
  }, [audioFiles])

  const handleChange: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const file = audioFiles.find(file => file.name === target.value)
    if (!file) throw Error('selected file not found')
    setAudioFile(file)
  }

  return {
    storeName,
    audioFiles,
    audioFile,
    handleChange,
  }
}

export default (function AudioFileSelector({
  storeName,
  audioFiles,
  audioFile,
  handleChange,
}) {
  const placeholder = audioFiles.length
    ? 'select beat'
    : `no ${storeName} exist`

  return (
    <select
      className="text-width2"
      name={storeName}
      disabled={!audioFiles.length}
      placeholder={`no ${storeName} exist`}
      onChange={handleChange}
      value={audioFile?.name ?? placeholder}
    >
      <>
        <option value={placeholder} disabled hidden>
          {placeholder}
        </option>
        {audioFiles.map(audioFile => (
          <option key={audioFile.name} value={audioFile.name}>
            {audioFile.name}
          </option>
        ))}
      </>
    </select>
  )
} as FC<ReturnType<typeof useAudioFileSelector>>)
