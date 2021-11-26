import { FC, useMemo, useState } from 'react'
import useMediaDevices from '../context/MediaDeviceContext'

const useAudioDevice = () => {
  const [audioRecording, setAudioRecording] = useState<Blob | null>(null)
  const handleDeleteRecording = () => setAudioRecording(null)

  const audioDeviceStream = useMediaDevices()

  const mediaRecorder = useMemo(() => {
    const mediaRecorder = new MediaRecorder(audioDeviceStream, {})

    mediaRecorder.ondataavailable = ({ data }) =>
      setAudioRecording(new Blob([data], { type: 'audio/mpeg' }))

    return mediaRecorder
  }, [setAudioRecording, audioDeviceStream])

  return {
    audioRecording,
    mediaRecorder,
    handleDeleteRecording,
  }
}

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const { audioRecording, mediaRecorder, handleDeleteRecording } =
    useAudioDevice()

  const handleStartRecording = () => {
    if (isRecording) mediaRecorder.stop()
    else mediaRecorder.start()
    setIsRecording(!isRecording)
  }

  const handlePauseRecording = () => {
    if (isPaused) mediaRecorder.resume()
    else mediaRecorder.pause()
    setIsPaused(!isPaused)
  }

  return {
    mediaRecorder,
    audioRecording,
    isRecording,
    isPaused,
    handleStartRecording,
    handlePauseRecording,
    handleDeleteRecording,
  }
}

export default (function AudioRecorderControls({
  audioRecording,
  isRecording,
  isPaused,
  handleStartRecording,
  handlePauseRecording,
  handleDeleteRecording,
}) {
  return (
    <>
      <div className="row">
        <button type="button" onClick={handleStartRecording}>
          {isRecording ? 'stop' : 'record'}
        </button>
        <button
          type="button"
          disabled={!isRecording}
          onClick={handlePauseRecording}
        >
          {isPaused ? 'resume' : 'pause'}
        </button>
        <button
          type="button"
          disabled={!audioRecording}
          onClick={handleDeleteRecording}
        >
          delete
        </button>
      </div>
    </>
  )
} as FC<ReturnType<typeof useAudioRecorder>>)
