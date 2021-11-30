import { openDB, type DBSchema, type IDBPDatabase } from 'idb/with-async-ittr'

export type FileStoreFields<T extends object = object> = { file: File } & T

export type TuneStoreFields = FileStoreFields<{ notes: string[] }>
export type BeatStoreFields = FileStoreFields

interface FileStore<T extends object = object> {
  key: string
  value: FileStoreFields<T>
  indexes: { lastModified: number }
}

interface AudioFilesSchema extends DBSchema {
  tunes: FileStore<TuneStoreFields>
  beats: FileStore
}

export type AudioFileStores = 'tunes' | 'beats'

export type AudioFilesDB = IDBPDatabase<AudioFilesSchema>

export const openAudioFilesDB = async () => {
  const db = await openDB<AudioFilesSchema>('audio-files', 1, {
    upgrade(db) {
      const tunesStore = db.createObjectStore('tunes', {
        keyPath: 'file.name',
      })

      const beatsStore = db.createObjectStore('beats', {
        keyPath: 'file.name',
      })

      tunesStore.createIndex('lastModified', 'file.lastModified', {
        unique: false,
      })
      beatsStore.createIndex('lastModified', 'file.lastModified', {
        unique: false,
      })
    },
  })

  return db
}
