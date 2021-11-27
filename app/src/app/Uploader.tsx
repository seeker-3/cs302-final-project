import { FC } from 'react'
import FileSaver from '../components/AudioFileSaverForm'
import AudioFileUploader from '../components/AudioFileUploader'

export default (function Uploader() {
  return (
    <FileSaver
      action="upload"
      render={fileSaverForm => <AudioFileUploader {...fileSaverForm} />}
    />
  )
} as FC)
