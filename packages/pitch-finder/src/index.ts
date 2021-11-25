import { convertBufferToNotes } from './lib'

void (async () => {
  // TODO:
  // Fetch the file provided by user and 
  // plug that into "file" var,
  // but also provide option to use sample file
  // e.g. the default (C-major2.wav)

  // example:
  // defaultFile ? file = userFile : file = 'C-major2.wav'

  let file = 'C-major2.wav'
  const response = await fetch(file)

  if (!response.ok) {
    throw Error('${file} not found!')
  }
  const buffer = await response.arrayBuffer()
  const notes = await convertBufferToNotes(buffer)
  console.log(notes)
})().catch(console.error)
