import { createContext, useContext, useState, type FC } from 'react'
import { type FileStoreFields } from '../db/indexedDB'
import useSelector, { type UseSelector } from '../hooks/useSelector'
import useAudioFilesIndexedDB from './AudioFilesIndexedDBContext'

const tuneInstrumentList = ['original', 'piano']
// const beatInstrumentsList = ['original', 'recording']
const beatInstrumentsList = ['original', 'recorded']

const useAudioContextBody = () => {
  const store = useAudioFilesIndexedDB()

  const [beatPlayerAudio, setBeatPlayerAudio] = useState<Blob | null>(null)
  const [tunePlayerAudio, setTunePlayerAudio] = useState<Blob | null>(null)

  const tuneFiles = useSelector(store.tunes)
  const beatFiles = useSelector(store.beats)
  const tuneInstruments = useSelector(tuneInstrumentList)
  const beatInstruments = useSelector(beatInstrumentsList)

  return {
    tunePlayerAudio,
    setTunePlayerAudio,
    tuneFiles,
    tuneInstruments,
    beatPlayerAudio,
    setBeatPlayerAudio,
    beatFiles,
    beatInstruments,
  }
}

// Context

const AudioContext = createContext<ReturnType<
  typeof useAudioContextBody
> | null>(null)

export const AudioProvider: FC = ({ children }) => (
  <AudioContext.Provider value={useAudioContextBody()}>
    {children}
  </AudioContext.Provider>
)

function useAudio() {
  const audioContext = useContext(AudioContext)
  if (!audioContext) throw Error('audio files context did not load properly')
  return audioContext
}

// tailored hooks
export const useTuneAudio = () => {
  const { tunePlayerAudio, setTunePlayerAudio, tuneFiles, tuneInstruments } =
    useAudio()
  return {
    tuneAudioFile: tuneFiles.selected?.file ?? null,
    tunePlayerAudio,
    setTunePlayerAudio,
    tuneFiles,
    tuneInstruments,
  }
}
export const useBeatAudio = () => {
  const { beatPlayerAudio, setBeatPlayerAudio, beatFiles, beatInstruments } =
    useAudio()

  return {
    beatAudioFile: beatFiles.selected?.file ?? null,
    beatPlayerAudio,
    setBeatPlayerAudio,
    beatFiles,
    beatInstruments,
  }
}

// this does not need generic type information because it's only used as a common interface in deeply nested components
export type UseFileSelector = UseSelector<FileStoreFields>
export type UseInstrumentSelector = UseSelector<string>
