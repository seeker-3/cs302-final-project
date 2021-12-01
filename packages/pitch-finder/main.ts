import { convertBufferToNotes } from './src/lib'

void (async () => {
  let file = 'C-major2.wav'
  const response = await fetch(file)

  if (!response.ok) {
    throw Error('${file} not found!')
  }
  const buffer = await response.arrayBuffer()
  const notes = await convertBufferToNotes(buffer)
  console.log(notes)
})().catch(console.error)
