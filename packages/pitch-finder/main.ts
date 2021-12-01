import { convertBlobToNotes } from './src/lib'

void (async () => {
  const file = 'C-major2.wav'
  const response = await fetch(file)

  if (!response.ok) {
    throw Error('${file} not found!')
  }

  const notes = await convertBlobToNotes(await response.blob())
  console.log(notes)
})().catch(console.error)
