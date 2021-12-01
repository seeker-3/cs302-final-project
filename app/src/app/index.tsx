import { type FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import AudioFileSaver from '../components/AudioFileSaverForm'
import Banner from '../components/Banner'
import AudioFileRecorder from './AudioFileRecorder'
import AudioFileUploader from './AudioFileUploader'
import BeatEditor from './BeatEditor'
import TuneEditor from './TuneEditor'

export default (function App() {
  return (
    <main className="column-stretch">
      <div className="column-center">
        <ErrorBoundary
          fallback={<p className="text-center">audio file recorder crashed</p>}
        >
          <AudioFileSaver
            action="recording"
            render={fileSaverForm => <AudioFileRecorder {...fileSaverForm} />}
          />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<p className="text-center">audio file uploader crashed</p>}
        >
          <AudioFileSaver
            action="upload"
            render={fileSaverForm => <AudioFileUploader {...fileSaverForm} />}
          />
        </ErrorBoundary>
      </div>
      <div className="audio-editor">
        <ErrorBoundary
          fallback={<p className="text-center">tune editor crashed</p>}
        >
          <TuneEditor />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<p className="text-center">beat editor crashed</p>}
        >
          <BeatEditor />
        </ErrorBoundary>
      </div>
      <Banner />
    </main>
  )
} as FC)
