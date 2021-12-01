import { type FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Banner from '../components/Banner'
import AudioFileRecorder from './AudioFileRecorder'
import AudioFileSaver from '../components/AudioFileSaverForm'
import AudioFileUploader from './AudioFileUploader'
import Beat from './BeatEditor'
import Tune from './TuneEditor'

export default (function App() {
  return (
    <main className="column">
      <div className="column align-items-end">
        <ErrorBoundary
          fallback={<p className="center">audio file recorder crashed</p>}
        >
          <AudioFileSaver
            action="recording"
            render={fileSaverForm => <AudioFileRecorder {...fileSaverForm} />}
          />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<p className="center">audio file uploader crashed</p>}
        >
          <AudioFileSaver
            action="upload"
            render={fileSaverForm => <AudioFileUploader {...fileSaverForm} />}
          />
        </ErrorBoundary>
      </div>
      <div className="column grow two-static-children">
        <ErrorBoundary fallback={<p className="center">tune editor crashed</p>}>
          <Tune />
        </ErrorBoundary>
        <ErrorBoundary fallback={<p className="center">beat editor crashed</p>}>
          <Beat />
        </ErrorBoundary>
      </div>
      <Banner />
    </main>
  )
} as FC)
