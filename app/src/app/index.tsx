import { FC } from 'react'
import AudioFileRecorder from '../components/AudioFileRecorder'
import AudioFileSaver from '../components/AudioFileSaverForm'
import AudioFileUploader from '../components/AudioFileUploader'
import Banner from '../components/Banner'
import Editor from './Editor'

export default (function Layout() {
  return (
    <main className="column">
      <div className="column align-items-end">
        <AudioFileSaver
          action="recording"
          render={fileSaverForm => <AudioFileRecorder {...fileSaverForm} />}
        />
        <AudioFileSaver
          action="upload"
          render={fileSaverForm => <AudioFileUploader {...fileSaverForm} />}
        />
      </div>
      <div className="column grow">
        <Editor title="Tune" storeName="tunes" />
        <Editor title="Beat" storeName="beats" />
      </div>
      <Banner />
    </main>
  )
} as FC)
