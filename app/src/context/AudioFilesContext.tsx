import {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { AudioFilesDB, AudioFileStores, openAudioFiles } from '../db/indexedDB'
import useFileSelector from '../hooks/useFileSelector'

interface AudioFilesReducerState {
  tunes: File[]
  beats: File[]
}

const audioFilesReducer = (
  state: AudioFilesReducerState,
  update: {
    tunes?: File[]
    beats?: File[]
  }
) => ({
  ...state,
  ...update,
})

const useAudioContextBody = () => {
  const ref = useRef<AudioFilesDB | null>(null)

  const [store, dispatch] = useReducer(audioFilesReducer, {
    tunes: [],
    beats: [],
  })

  const tuneSelector = useFileSelector(store.tunes)
  const beatSelector = useFileSelector(store.beats)

  useEffect(() => {
    void (async () => {
      const db = (ref.current = await openAudioFiles())

      const [tunes, beats] = await Promise.all([
        db.getAll('tunes'),
        db.getAll('beats'),
      ])

      dispatch({
        tunes,
        beats,
      })

      return () => db.close()
    })().catch(console.error)
  }, [])

  if (!ref.current) return null

  const db = ref.current

  const saveAudioFile = async (storeName: AudioFileStores, audioFile: File) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const { store } = transaction
    const fileExists = await store.get(audioFile.name)

    // this should display an error to the user
    if (fileExists) {
      await transaction.done
      return null
    }

    const result = await store.add(audioFile)
    const files = await store.getAll()
    await transaction.done

    dispatch({ [storeName]: files })
    return result
  }

  const deleteAudioFile = async (
    storeName: AudioFileStores,
    audioFile: File
  ) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const { store } = transaction

    await store.delete(audioFile.name)

    const files = await store.getAll()
    await transaction.done

    dispatch({ [storeName]: files })
  }

  return {
    ...store,
    saveAudioFile,
    deleteAudioFile,
  }
}

const AudioFilesContext = createContext<ReturnType<
  typeof useAudioContextBody
> | null>(null)

export const AudioFilesProvider: FC = ({ children }) => {
  const audioFilesContext = useAudioContextBody()
  if (!audioFilesContext) return null

  return (
    <AudioFilesContext.Provider value={audioFilesContext}>
      {children}
    </AudioFilesContext.Provider>
  )
}

export default function useAudioFiles() {
  const audioFilesContext = useContext(AudioFilesContext)
  if (!audioFilesContext)
    throw Error('audio files context did not load properly')
  return audioFilesContext
}
