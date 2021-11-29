import { FC, MouseEventHandler } from 'react'

export default (function AudioFileProcessor({
  audioFile,
  processorDisabled,
  handleProcess,
}) {
  return (
    <button disabled={processorDisabled || !audioFile} onClick={handleProcess}>
      process
    </button>
  )
} as FC<{
  audioFile: File | null
  processorDisabled: boolean
  handleProcess: MouseEventHandler<HTMLButtonElement>
}>)
