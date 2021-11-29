import { FC } from 'react'
import useAudioFilesIndexedDB from '../../context/AudioFilesIndexedDBContext'
import { AudioFileStores } from '../../db/indexedDB'

export default (function AudioFileDeleter({ storeName, audioFile }) {
  const { deleteAudioFile } = useAudioFilesIndexedDB()
  return (
    <button
      disabled={!audioFile}
      onClick={async () => {
        const cancel =
          import.meta.env.PROD &&
          !confirm(`are you sure you want to delete ${audioFile?.name}?`)
        if (!audioFile || cancel) return
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
