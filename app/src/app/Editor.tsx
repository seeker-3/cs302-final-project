import { FC } from 'react'
import AudioFileAnalyzer from '../components/editor/AudioFileAnalyzer'
import AudioFileDeleter from '../components/editor/AudioFileDeleter'
import AudioFilePlayer from '../components/editor/AudioFilePlayer'
import AudioFileSelector, {
  useAudioFileSelector,
} from '../components/editor/AudioFileSelector'
import { AudioFileStores } from '../context/db/indexedDB'

export default (function ({ title, storeName }) {
  const selector = useAudioFileSelector(storeName)
  const { audioFile } = selector

  return (
    <div className="column grow">
      <h1>{title}</h1>
      <div className="column align-items-start">
        <div className="row">
          <AudioFileSelector {...selector} />
          <AudioFileAnalyzer audioFile={audioFile} />
          <AudioFileDeleter storeName={storeName} audioFile={audioFile} />
        </div>
        <div className="row">
          <AudioFilePlayer audioFile={audioFile} />
          <select className="width2" name="instrument">
            <option value="piano">piano</option>
            <option value="fish">fish</option>
          </select>
        </div>
      </div>
      <div className="grow">
        <h1>oh my</h1>
      </div>
    </div>
  )
} as FC<{
  title: string
  storeName: AudioFileStores
}>)
