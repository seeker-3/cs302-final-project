import { pianoSynth } from './src/lib'
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

const audio = document.querySelector('audio')

if (!audio) throw Error()

const button = document.createElement('button')
button.innerText = 'play'

button.onclick = async () => {
  const blob = await pianoSynth(musicalNotes)

  console.log(blob)

  if (audio.src) URL.revokeObjectURL(audio.src)
  audio.src = URL.createObjectURL(blob)
}

document.body.appendChild(button)
