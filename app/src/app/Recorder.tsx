import { FC } from 'react'
import AudioFileSaver from '../components/AudioFileSaverForm'
import AudioRecorderControls from '../components/AudioFileRecorder'

export default (function Recorder() {
  return (
    <AudioFileSaver
      action="recording"
      render={fileSaverForm => {
        return <AudioRecorderControls {...fileSaverForm} />
      }}
    />
  )
} as FC)
