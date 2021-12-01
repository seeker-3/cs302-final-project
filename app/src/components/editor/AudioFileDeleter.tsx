import { type FC } from 'react'
import { useEditor } from '.'
import useAudioFilesIndexedDB from '../../context/AudioFilesIndexedDBContext'

export default (function AudioFileDeleter() {
  const {
    audioFile,
    storeName,
    fileDeleter: { disabled, callback } = {},
  } = useEditor()
  const { deleteAudioFile } = useAudioFilesIndexedDB()
  return (
    <button
      disabled={disabled || !audioFile}
      onClick={async event => {
        const cancel =
          import.meta.env.PROD &&
          !confirm(`are you sure you want to delete ${audioFile?.name}?`)
        if (!audioFile || cancel) return
        await deleteAudioFile(storeName, audioFile)
        callback && (await callback(event))
      }}
    >
      delete
    </button>
  )
} as FC)
