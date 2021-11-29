import { FC } from 'react'
import FileSaver from '../components/form/AudioFileSaverForm'
import AudioFileUploader from '../components/form/AudioFileUploader'

export default (function Uploader() {
  return (
    <FileSaver
      action="upload"
      render={fileSaverForm => <AudioFileUploader {...fileSaverForm} />}
    />
  )
} as FC)
