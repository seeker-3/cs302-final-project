/*
  Synth Function:
  Usage: Takes an input of an array of musical notes
    and outputs a midi audio of a piano playing the notes
*/

// import * as Tone from 'tone'
import { Piano } from '@tonejs/piano'
const wait = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

export async function pianoSynth(musicalNotes: string[]) {
  // document.documentElement.addEventListener('mousedown', () => {
  // create a Piano from @tonejs/piano
  const piano = new Piano({
    velocities: 5,
  })

  // create all dependencies to be able to record piano audio
  const pianoContext = piano.context
  const mediaStreamDestination = pianoContext.createMediaStreamDestination()
  const recorder = new MediaRecorder(mediaStreamDestination.stream)
  const chunks: BlobPart[] = []

  // Once recording is done, export it
  recorder.ondataavailable = event => {
    chunks.push(event.data)
  }
  // connect piano to recording steam
  piano.connect(mediaStreamDestination)

  if (import.meta.env.DEV) console.log(musicalNotes)

  let i = 0.0
  await piano.load()

  // play all the notes in the musicalNotes array
  for (const note of musicalNotes) {
    //starts recording once the notes start playing
    if (recorder.state !== 'recording') recorder.start()

    piano.keyDown({ note, time: `+${i}` })
    piano.keyUp({ note, time: `+${i + 0.25}` })
    // increment size determines note length -- currently
    // 0,5s note length
    i += 0.33
  }

  //stops recording once all the notes have been played in the array
  const mediaRecorderOnstopPromise = new Promise<Blob>(
    resolve =>
      (recorder.onstop = () => resolve(new Blob(chunks, { type: 'audio/wav' })))
  )

  await wait(i * 1000 + 1000)
  recorder.stop()

  // returns piano audio file
  return mediaRecorderOnstopPromise
}
