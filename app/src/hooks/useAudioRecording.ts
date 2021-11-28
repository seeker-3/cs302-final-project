import { useEffect, useState } from 'react'
export default function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const [audioRecording, setAudioRecording] = useState<Blob | undefined>()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  useEffect(() => {
    void (async () => {
      const mediaRecorder = new MediaRecorder(
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      )

      mediaRecorder.ondataavailable = ({ data }) =>
        setAudioRecording(new Blob([data], { type: 'audio/wav' }))

      setMediaRecorder(mediaRecorder)
    })().catch(console.error)
  }, [])

  // if (!mediaRecorder) return { loading: true } as { loading: true }

  const handleStartAndStopRecording = () => {
    if (!mediaRecorder)
      throw Error('hook must finish loading before this function can be used')
    if (isRecording) mediaRecorder.stop()
    else mediaRecorder.start()
    setIsRecording(!isRecording)
  }

  const handlePauseRecording = () => {
    if (!mediaRecorder)
      throw Error('hook must finish loading before this function can be used')
    if (isPaused) mediaRecorder.resume()
    else mediaRecorder.pause()
    setIsPaused(!isPaused)
  }

  const handleDeleteRecording = () =>
    audioRecording && setAudioRecording(undefined)

  return {
    loading: !mediaRecorder,
    isRecording,
    isPaused,
    audioRecording,
    handleStartAndStopRecording,
    handlePauseRecording,
    handleDeleteRecording,
  } as const
}
