import { FC } from 'react'

export default (function AudioFileAnalyzer({ audioFile }) {
  return (
    <button disabled={!audioFile} onClick={() => alert('analyze this')}>
      analyze
    </button>
  )
} as FC<{ audioFile: File | null }>)
