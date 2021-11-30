import { PercussionInstruments } from '@dothum/percussion'
import { createContext, useContext, useState, type FC } from 'react'
import { type FileStoreFields } from '../db/indexedDB'
import useSelector, { type UseSelector } from '../hooks/useSelector'
import useAudioFilesIndexedDB from './AudioFilesIndexedDBContext'

const tuneInstrumentList = ['original', 'piano']
const beatInstrumentsList = ['hiHat', 'snare', 'kick']

// export type TuneInstrumentList = (typeof tuneInstrumentList )[number]
// export type BeatInstrumentList = typeof tuneInstrumentList[number]

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
  const instrument = beatInstruments.selected

  const instrumentIndex =
    instrument === 'hiHat'
      ? PercussionInstruments.hiHat
      : instrument === 'snare'
      ? PercussionInstruments.snare
      : instrument === 'kick'
      ? PercussionInstruments.kick
      : null

  if (instrumentIndex === null)
    throw Error('invalid instrument. could not convert to index')

  return {
    beatAudioFile: beatFiles.selected?.file ?? null,
    beatPlayerAudio,
    setBeatPlayerAudio,
    beatFiles,
    beatInstruments,
    instrumentIndex,
  }
}

// this does not need generic type information because it's only used as a common interface in deeply nested components
export type UseFileSelector = UseSelector<FileStoreFields>
export type UseInstrumentSelector = UseSelector<string>
