import { ChangeEventHandler, FC, useState } from 'react'
import useAudioFiles from '../context/AudioFilesContext'
import { AudioFileStores } from '../context/indexedDB'

export const useAudioFileSelector = (storeName: AudioFileStores) => {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const { [storeName]: audioFiles } = useAudioFiles()

  const handleChange: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const file = audioFiles.find(file => file.name === target.value)
    if (!file) throw Error('selected audio file not found')
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
  return (
    <select
      className="input-width"
      name={storeName}
      disabled={!audioFiles.length}
      placeholder={`no ${storeName} exist`}
      onChange={handleChange}
      value={audioFile?.name}
    >
      {audioFiles.map(audioFile => (
        <option key={audioFile.name} value={audioFile.name}>
          {audioFile.name}
        </option>
      ))}
    </select>
  )
} as FC<ReturnType<typeof useAudioFileSelector>>)
