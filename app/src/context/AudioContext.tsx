import { createContext, useContext, useState, type FC } from 'react'
import { type FileStoreFields } from '../db/indexedDB'
import useSelector, { type UseSelector } from '../hooks/useSelector'
import useAudioFilesIndexedDB from './AudioFilesIndexedDBContext'

const tuneInstrumentList = ['original', 'piano']
const beatInstrumentList: string[] = [
  // 'original', 'drum'
]

// export type TuneInstrumentList = (typeof tuneInstrumentList )[number]
// export type BeatInstrumentList = typeof tuneInstrumentList[number]

const useAudioContextBody = () => {
  const store = useAudioFilesIndexedDB()

  const [beatPlayerAudio, setBeatPlayerAudio] = useState<Blob | null>(null)
  const [tunePlayerAudio, setTunePlayerAudio] = useState<Blob | null>(null)

  const tuneFiles = useSelector(store.tunes)
  const beatFiles = useSelector(store.beats)
  const tuneInstruments = useSelector(tuneInstrumentList)
  const beatInstruments = useSelector(beatInstrumentList)

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

export type UseAudioContextTunes = Omit<
  ReturnType<typeof useAudioContextBody>,
  'beatFiles' | 'beatInstruments'
>

export type UseAudioContextBeats = Omit<
  ReturnType<typeof useAudioContextBody>,
  'tuneFiles' | 'tuneInstruments'
>

// Context

const AudioContext = createContext<ReturnType<
  typeof useAudioContextBody
> | null>(null)

export const AudioProvider: FC = ({ children }) => (
  <AudioContext.Provider value={useAudioContextBody()}>
    {children}
  </AudioContext.Provider>
)

export default function useAudio() {
  const audioContext = useContext(AudioContext)
  if (!audioContext) throw Error('audio files context did not load properly')
  return audioContext
}

export const useTuneAudio = () => {
  const { tunePlayerAudio, setTunePlayerAudio, tuneFiles, tuneInstruments } =
    useAudio()
  return { tunePlayerAudio, setTunePlayerAudio, tuneFiles, tuneInstruments }
}
export const useBeatAudio = () => {
  const { beatPlayerAudio, setBeatPlayerAudio, beatFiles, beatInstruments } =
    useAudio()
  return { beatPlayerAudio, setBeatPlayerAudio, beatFiles, beatInstruments }
}

// this does not need generic type information because it's only used as a common interface in deeply nested components
export type UseFileSelector = UseSelector<FileStoreFields>
export type UseInstrumentSelector = UseSelector<string>
