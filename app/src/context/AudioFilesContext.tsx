import {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { AudioFilesDB, AudioFileStores, openAudioFiles } from './indexedDB'

interface AudioFilesReducerState {
  tunes: File[]
  beats: File[]
}

const audioFileReducer = (
  state: AudioFilesReducerState,
  update: {
    tunes?: File[]
    beats?: File[]
  }
) => ({
  ...state,
  ...update,
})

type SaveAudioFile = (
  store: AudioFileStores,
  audioFile: File
) => Promise<string | null>

type DeleteAudioFile = (
  store: AudioFileStores,
  audioFile: File
) => Promise<void>

interface AudioFilesContextValue extends AudioFilesReducerState {
  saveAudioFile: SaveAudioFile
  deleteAudioFile: DeleteAudioFile
}

const AudioFilesContext = createContext<AudioFilesContextValue | null>(null)

export const AudioFilesProvider: FC = ({ children }) => {
  const ref = useRef<AudioFilesDB | null>(null)

  const [store, dispatch] = useReducer(audioFileReducer, {
    tunes: [],
    beats: [],
  })

  useEffect(() => {
    if (ref.current)
      throw Error('audio files context effect not behaving as expected')
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
    })().catch(console.error)
  }, [])

  if (!ref.current) return null

  const db = ref.current

  const saveAudioFile: SaveAudioFile = async (
    storeName: AudioFileStores,
    audioFile: File
  ) => {
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

  const deleteAudioFile: DeleteAudioFile = async (
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

  return (
    <AudioFilesContext.Provider
      value={{
        ...store,
        saveAudioFile,
        deleteAudioFile,
      }}
    >
      {children}
    </AudioFilesContext.Provider>
  )
}

export default function useAudioFilesContext(): AudioFilesContextValue {
  const audioFilesContext = useContext(AudioFilesContext)
  if (!audioFilesContext)
    throw Error('audio files context did not load properly')
  return audioFilesContext
}
