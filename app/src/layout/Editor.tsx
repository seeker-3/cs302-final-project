import { FC } from 'react'
import AudioFileDeleter from '../components/AudioFileDeleter'
import AudioFilePlayer from '../components/AudioFilePlayer'
import AudioFileSelector, {
  useAudioFileSelector,
} from '../components/AudioFileSelector'
import { AudioFileStores } from '../context/indexedDB'

export default (function ({ title, storeName }) {
  const selector = useAudioFileSelector(storeName)
  const { audioFile } = selector

  return (
    <div className="column grow">
      <h1>{title}</h1>
      <div className="column align-items-start">
        <div className="row">
          <AudioFileSelector {...selector} />
          <button disabled={!audioFile} onClick={() => alert('analyze this')}>
            analyze
          </button>
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
