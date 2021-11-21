// const request = indexedDB.open('app')

// interface AudioFile {
//   date: Date
//   title: string
//   data: ArrayBuffer
// }

// let db

// request.onsuccess = event => {
//   db = request.result
// }

// request.onerror = event => {
//   console.error('Database error: ')
// }

// request.onupgradeneeded = event => {
//   const db = request.result

//   const objectStore = db.createObjectStore('audio-files', {
//     keyPath: 'date',
//   })

//   objectStore.createIndex('title', 'title', { unique: false })
//   objectStore.createIndex('date', 'date', { unique: true })

//   objectStore.transaction.oncomplete = event => {
//     // add data
//   }
// }

export {}
