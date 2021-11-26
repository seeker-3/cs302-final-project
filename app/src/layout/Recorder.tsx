import { FC } from 'react'
import FileSaver from '../components/AudioFileSaver'
import MediaRecorderControls, {
  useAudioRecorder,
} from '../components/AudioRecorder'

export default (function Recorder() {
  const mediaRecorder = useAudioRecorder()

  return (
    <FileSaver action="recording" audioBlob={mediaRecorder.audioRecording}>
      <MediaRecorderControls {...mediaRecorder} />
    </FileSaver>
  )
} as FC)
