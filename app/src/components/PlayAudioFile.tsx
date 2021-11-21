import { FC, useEffect, useState } from 'react'

export default (function ({ audioData }) {
  const [audioFileURL, setAudioFileURL] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(audioData)
    setAudioFileURL(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [audioData, setAudioFileURL])

  if (!audioFileURL) return null

  return (
    <div className="row">
      <audio controls>
        <source src={audioFileURL} type="audio/mpeg" />
      </audio>
    </div>
  )
} as FC<{ audioData: Blob }>)
