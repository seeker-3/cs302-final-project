import { FC, useEffect, useRef } from 'react'

// React Component
// Simple example of increasing the volume of an audio source with a gain node
export default (function AudioSource({ audioSourceURL }) {
  const audioRef = useRef(null)

  // create source after ref is defined
  useEffect(() => {
    if (!audioRef?.current) return

    const mediaElement = audioRef.current

    const audioContext = new AudioContext()
    const gainNode = audioContext.createGain()
    gainNode.gain.value = 2

    const mediaElementSource =
      audioContext.createMediaElementSource(mediaElement)

    mediaElementSource.connect(gainNode)
    gainNode.connect(audioContext.destination)
    // source -> gainNode -> destination
  }, [audioRef])

  return (
    <audio ref={audioRef} controls>
      <source src={audioSourceURL} type="audio/mpeg" />
    </audio>
  )
} as FC<{ audioSourceURL: string }>)
