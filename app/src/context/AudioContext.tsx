import { createContext, FC, useContext, useState } from 'react'
import useSelector, { UseSelector } from '../hooks/useSelector'
import useAudioFilesIndexedDB from './AudioFilesIndexedDBContext'

const tuneInstrumentList = ['original', 'piano', 'fish']
const beatInstrumentList = ['original', 'drum']

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

export type UseFileSelector = UseSelector<File>
export type UseInstrumentSelector = UseSelector<string>
