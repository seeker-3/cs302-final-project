import { type FC } from 'react'
import { useEditor } from '.'

export default (function AudioFileProcessor() {
  const { audioFile, fileProcessor: { disabled = false, handler } = {} } =
    useEditor()
  return (
    <button disabled={!handler || disabled || !audioFile} onClick={handler}>
      process
    </button>
  )
} as FC)
