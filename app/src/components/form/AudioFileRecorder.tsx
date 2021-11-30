import { useEffect, type FC } from 'react'
import useAudioRecording from '../../hooks/useAudioRecording'
import { type FileSaverForm } from './AudioFileSaverForm'

export default (function AudioFileRecorder({ setValue, resetField, reset }) {
  const {
    loading,
    audioRecording,
    isRecording,
    isPaused,
    handleStartAndStopRecording,
    handlePauseRecording,
    handleDeleteRecording,
  } = useAudioRecording()

  // fileData field for this form never gets registered to an input and is controlled with this effect
  useEffect(() => {
    if (!audioRecording) return resetField('fileData')

    const file = new File([audioRecording], 'recording', {
      type: audioRecording.type,
    })

    const container = new DataTransfer()
    container.items.add(file)

    setValue('fileData', container.files)
  }, [audioRecording, setValue, resetField])

  return (
    <div className="row">
      <button
        type="button"
        onClick={handleStartAndStopRecording}
        disabled={loading}
      >
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
        onClick={() => {
          handleDeleteRecording()
          reset()
        }}
      >
        delete
      </button>
    </div>
  )
} as FC<FileSaverForm>)
