import { FC, useEffect, useState } from 'react'

export default (function ({ audioFile }) {
  const [audioFileURL, setAudioFileURL] = useState<string | null>(null)

  useEffect(() => {
    if (!audioFile || audioFileURL) return
    const url = URL.createObjectURL(audioFile)
    setAudioFileURL(url)
    return () => URL.revokeObjectURL(url)
  }, [audioFile, audioFileURL])

  return (
    <div className="row">
      <audio controls>
        {audioFileURL && <source src={audioFileURL} type="audio/mpeg" />}
      </audio>
    </div>
  )
} as FC<{
  audioFile: File | null
}>)
