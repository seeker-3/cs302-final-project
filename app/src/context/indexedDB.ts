import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr'

interface FileStore<T extends File = File> {
  key: string
  value: T
  indexes: { lastModified: number }
}

export type AudioFileStores = 'tunes' | 'beats'

export interface AudioFilesSchema extends DBSchema {
  tunes: FileStore
  beats: FileStore
}

export type AudioFilesDB = IDBPDatabase<AudioFilesSchema>

export const openAudioFiles = async () => {
  const db = await openDB<AudioFilesSchema>('audio-files', 1, {
    upgrade(db) {
      const tunesStore = db.createObjectStore('tunes', {
        keyPath: 'name',
      })

      const beatsStore = db.createObjectStore('beats', {
        keyPath: 'name',
      })

      tunesStore.createIndex('lastModified', 'lastModified')
      beatsStore.createIndex('lastModified', 'lastModified')
    },
  })

  return db
}

// export const addAudioFile = async (store: AudioFileStores, audioFile: File) => {
//   const db = await openAudioFiles()
//   const result = await db.add(store, audioFile)
//   return result
// }

// export const getAudioFile = async (store: AudioFileStores, audioFile: File) => {
//   const db = await openAudioFiles()
//   const file = await db.get(store, audioFile.lastModified)
//   return file
// }

// export const getAllAudioFiles = async (store: AudioFileStores) => {
//   const db = await openAudioFiles()
//   const files = await db.getAll(store)
//   return files
// }

// export const useAudioFiles = (store: AudioFileStores) => {
//   const [audioFiles, setAudioFiles] = useState<File[] | null>(null)

//   useEffect(() => {
//     void (async () => {
//       const audioFiles = await getAllAudioFiles(store)
//       setAudioFiles(audioFiles)
//     })().catch(console.error)
//   }, [store])

//   return audioFiles
// }
