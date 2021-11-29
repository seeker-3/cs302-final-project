import { FC } from 'react'
import useAudioFiles from '../../context/AudioFilesContext'
import { AudioFileStores } from '../../db/indexedDB'

export default (function AudioFileDeleter({ storeName, audioFile }) {
  const { deleteAudioFile } = useAudioFiles()
  return (
    <button
      disabled={!audioFile}
      onClick={async () => {
        if (
          !audioFile
          // || !confirm(`are you sure you want to delete ${audioFile.name}?`)
        )
          return
        await deleteAudioFile(storeName, audioFile)
      }}
    >
      delete
    </button>
  )
} as FC<{
  storeName: AudioFileStores
  audioFile: File | null
}>)
