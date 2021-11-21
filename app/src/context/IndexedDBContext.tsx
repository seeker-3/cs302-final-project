import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr.js'
import { createContext, FC, useContext } from 'react'
import { useAsyncState } from '../utils/hooks'

export interface AudioFile {
  date: Date
  title: string
  data: File
}

interface Store<T> {
  key: string
  value: T
}

interface AudioFilesSchema extends DBSchema {
  'audio-files': Store<File>
}

type AppDB = IDBPDatabase<AudioFilesSchema>

const Context = createContext<AppDB | null>(null)

export const AudioFilesProvider: FC = ({ children }) => {
  const db = useAsyncState<AppDB>(async () => {
    return openDB<AudioFilesSchema>('app', 1, {
      upgrade(db) {
        console.log('upgrade')
        db.createObjectStore('audio-files', {
          keyPath: 'date',
        })
      },
    })
  })

  if (!db) return null

  return <Context.Provider value={db}>{children}</Context.Provider>
}

export default function useIndexedDB(): AppDB {
  const audioFilesDb = useContext(Context)
  if (!audioFilesDb) throw Error('useAudioFiles: did not load properly')
  return audioFilesDb
}
