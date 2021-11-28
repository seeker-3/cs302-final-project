import { FC, useState } from 'react'
import AudioFileAnalyzer from '../components/editor/AudioFileAnalyzer'
import AudioFileDeleter from '../components/editor/AudioFileDeleter'
import AudioFilePlayer from '../components/editor/AudioFilePlayer'
import AudioFileSelector, {
  useAudioFileSelector,
} from '../components/editor/AudioFileSelector'
import { AudioFileStores } from '../context/db/indexedDB'

export default (function ({ title, storeName, instruments, render }) {
  const audioFileSelector = useAudioFileSelector(storeName)
  const { audioFile } = audioFileSelector

  const [instrument, setInstrument] = useState(instruments[0])

  return (
    <div className="column grow">
      <h1>{title}</h1>
      <div className="column align-items-start">
        <div className="row">
          <AudioFileSelector {...audioFileSelector} />
          <AudioFileAnalyzer audioFile={audioFile} />
          <AudioFileDeleter storeName={storeName} audioFile={audioFile} />
        </div>
        <div className="row">
          <AudioFilePlayer audioFile={audioFile} />
          <select
            className="width2"
            name="instrument"
            disabled={!audioFile}
            value={instrument}
            onChange={({ target }) => {
              setInstrument(target.value)
            }}
          >
            {instruments.map(instrument => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grow">{render && render({ audioFile })}</div>
    </div>
  )
} as FC<{
  title: string
  storeName: AudioFileStores
  instruments: string[]
  render?: <T extends RenderProps>(props: RenderProps) => ReturnType<FC<T>>
}>)

type RenderProps = { audioFile: File | null }
