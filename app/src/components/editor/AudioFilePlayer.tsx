import { FC, useEffect, useState } from 'react'

export default (function ({ audioFile }) {
  const [audioFileURL, setAudioFileURL] = useState<string | undefined>()

  useEffect(() => {
    if (!audioFile) return setAudioFileURL(undefined)

    const url = URL.createObjectURL(audioFile)
    setAudioFileURL(url)
    return () => URL.revokeObjectURL(url)
  }, [audioFile])

  return <audio controls src={audioFileURL} />
} as FC<{
  audioFile: File | null
}>)
