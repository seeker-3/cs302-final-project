//import * as Tone from 'tone'
import { Piano } from '@tonejs/piano'
const wait = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

const musicalNotes = [
  'C4',
  'F4',
  'G4',
  'A4',
  'C4',
  'F4',
  'G4',
  'A4',
  'C4',
  'F4',
  'G4',
  'A4',
  'C4',
  'F4',
  'G4',
  'A4',
]

PianoSynth(musicalNotes)

export async function PianoSynth(musicalNotes: string[]) {
  //document.documentElement.addEventListener('mousedown', () => {
  //create a Piano from @tonejs/piano
  const piano = new Piano({
    velocities: 5,
  })
  piano.toDestination()

  //create all dependencies to be able to record piano audio
  //const audio = document.querySelector('audio')
  const actx = piano.context
  const dest = actx.createMediaStreamDestination()
  const recorder = new MediaRecorder(dest.stream)
  const chunks: BlobPart[] = []
  //connect piano to recording steam
  piano.connect(dest)
  piano.toMaster()

  console.log(musicalNotes)

  //play all the notes in the musicalNotes array
  await piano.load()
  console.log('loaded!')
  let i = 0.0
  let noteI = 0
  for (const note of musicalNotes) {
    if (noteI === 0) recorder.start()

    piano.keyDown({ note, time: `+${i}` })
    piano.keyUp({ note, time: `+${i + 0.25}` })
    // increment size determines note length -- currently
    // 0,5s note length
    i += 0.33
    noteI++
  }

  //Once recording is done, export it
  recorder.ondataavailable = evt => chunks.push(evt.data)
  let blob: Blob | null = null
  recorder.onstop = () => {
    blob = new Blob(chunks, { type: 'audio/mpeg; codecs=opus' })
  }

  await wait(i * 1000 + 1000)

  recorder.stop()

  return blob
  // })
}
