import { useEffect, useState, type FC } from 'react'
import { useEditor } from '.'

export default (function () // { audioFile }
{
  const { playerAudio } = useEditor()
  const [audioURL, setAudioURL] = useState('')

  useEffect(() => {
    if (!playerAudio) return setAudioURL('')
    const url = URL.createObjectURL(playerAudio)
    setAudioURL(url)
    return () => URL.revokeObjectURL(url)
  }, [playerAudio])

  return <audio controls src={audioURL} />
} as FC)
