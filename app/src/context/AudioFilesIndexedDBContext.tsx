import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type FC,
} from 'react'
import {
  openAudioFilesDB,
  type AudioFilesDB,
  type AudioFileStores,
  type BeatStoreFields,
  type FileStoreFields,
  type TuneStoreFields,
} from '../db/indexedDB'

type AudioFilesReducerState = {
  tunes: TuneStoreFields[]
  beats: BeatStoreFields[]
}

const audioFilesReducer = (
  state: AudioFilesReducerState,
  update: Partial<AudioFilesReducerState>
) => ({
  ...state,
  ...update,
})

const useContextBody = () => {
  const ref = useRef<AudioFilesDB | null>(null)

  const [store, dispatch] = useReducer(audioFilesReducer, {
    tunes: [],
    beats: [],
  })

  useEffect(() => {
    void (async () => {
      const db = (ref.current = await openAudioFilesDB())

      const [tunes, beats] = await Promise.all([
        db.getAll('tunes'),
        db.getAll('beats'),
      ])

      dispatch({
        tunes,
        beats,
      })

      return () => db.close()
    })()
  }, [])

  if (!ref.current) return null

  const db = ref.current

  const saveAudioFile = async <T extends FileStoreFields>(
    storeName: AudioFileStores,
    fields: T
  ) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const { store } = transaction
    const fileExists = await store.get(fields.file.name)

    // this should display an error to the user
    if (fileExists) {
      await transaction.done
      return null
    }

    const result = await store.add(fields)
    const storeContents = await store.getAll()
    await transaction.done

    dispatch({ [storeName]: storeContents })
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

const AudioFilesIndexedDBContext = createContext<ReturnType<
  typeof useContextBody
> | null>(null)

export const AudioFilesIndexedDBProvider: FC = ({ children }) => {
  const audioFilesIndexedDBContext = useContextBody()
  if (!audioFilesIndexedDBContext) return null

  return (
    <AudioFilesIndexedDBContext.Provider value={audioFilesIndexedDBContext}>
      {children}
    </AudioFilesIndexedDBContext.Provider>
  )
}

export default function useAudioFilesIndexedDB() {
  const audioFilesIndexedDBContext = useContext(AudioFilesIndexedDBContext)
  if (!audioFilesIndexedDBContext)
    throw Error('audio files indexedDB context did not load properly')
  return audioFilesIndexedDBContext
}
