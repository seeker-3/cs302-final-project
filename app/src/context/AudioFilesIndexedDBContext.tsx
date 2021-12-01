import { convertBlobToNotes } from '@dothum/pitch-finder'
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

  const saveAudioFile = async (storeName: AudioFileStores, file: File) => {
    let gotNotes = false
    try {
      const fields =
        storeName === 'tunes'
          ? {
              notes: await convertBlobToNotes(file),
            }
          : {}
      gotNotes = true

      const transaction = db.transaction(storeName, 'readwrite')
      const { store } = transaction
      const fileExists = await store.get(file.name)

      // this should display an error to the user
      if (fileExists) {
        await transaction.done
        return {
          incorrectField: 'filename' as const,
          error: `error: file named "${file.name}" already exists in ${storeName}`,
        }
      }

      const result = await store.add({
        ...fields,
        file,
      })
      const storeContents = await store.getAll()
      await transaction.done

      dispatch({ [storeName]: storeContents })
      return { result }
    } catch (error) {
      console.error(error)
      return {
        error: !gotNotes ? 'tune conversion failed' : 'an error occurred',
      }
    }
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
