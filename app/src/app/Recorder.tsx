import { FC } from 'react'
import AudioFileRecorder from '../components/form/AudioFileRecorder'
import AudioFileSaver from '../components/form/AudioFileSaverForm'

export default (function Recorder() {
  return (
    <AudioFileSaver
      action="recording"
      render={fileSaverForm => {
        return <AudioFileRecorder {...fileSaverForm} />
      }}
    />
  )
} as FC)
