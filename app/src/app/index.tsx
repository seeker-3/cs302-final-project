import { FC } from 'react'
import AudioFileRecorder from '../components/AudioFileRecorder'
import AudioFileSaver from '../components/AudioFileSaverForm'
import AudioFileUploader from '../components/AudioFileUploader'
import Banner from '../components/Banner'
import Percussion from '../components/Percussion'
import PitchFinder from '../components/PitchFinder'
import Editor from './Editor'

const tuneInstruments = ['piano', 'fish']
const beatInstruments = ['drum']

export default (function App() {
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
      <div className="column grow two-static-children">
        <Editor
          title="Tune"
          storeName="tunes"
          instruments={tuneInstruments}
          render={props => <PitchFinder {...props} />}
        />
        <Editor
          title="Beat"
          storeName="beats"
          instruments={beatInstruments}
          render={props => <Percussion {...props} />}
        />
      </div>
      <Banner />
    </main>
  )
} as FC)
