import { FC, useEffect, useState } from 'react'

export default (function ({ audioFile }) {
  const [audioFileURL] = useState(() => {
    console.log('created')
    return audioFile && URL.createObjectURL(audioFile)
  })

  useEffect(() => {
    if (!audioFileURL) return
    return () => {
      console.log('cleaned')
      URL.revokeObjectURL(audioFileURL)
    }
  }, [audioFileURL])

  return (
    <div className="row">
      <audio controls>
        {audioFileURL && <source src={audioFileURL} type="audio/*" />}
      </audio>
    </div>
  )
} as FC<{
  audioFile: File | null
}>)
