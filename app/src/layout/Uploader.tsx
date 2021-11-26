import { FC } from 'react'
import FileSaver from '../components/AudioFileSaver'
import AudioFileUploader, {
  useAudioFileUploader,
} from '../components/AudioFileUploader'

export default (function Uploader() {
  const audioFileUploader = useAudioFileUploader()
  return (
    <FileSaver
      action="upload"
      audioBlob={audioFileUploader.audioUpload}
      name={audioFileUploader.audioUpload?.name}
    >
      <AudioFileUploader {...audioFileUploader} />
    </FileSaver>
  )
} as FC)
