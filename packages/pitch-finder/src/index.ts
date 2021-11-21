import { convertBufferToNotes } from './lib'

void (async () => {
  const response = await fetch('C-major.wav')

  if (!response.ok) {
    throw Error('Response not okay')
  }
  const buffer = await response.arrayBuffer()
  await convertBufferToNotes(buffer)
})().catch(console.error)
