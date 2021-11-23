import PitchFinder, { AMDF, YIN } from 'pitchfinder'
import notes from './notes'
import { audioToMelody } from './lib'

const frequencyToNote = (input: number) => {
  const A4 = 440.0
  const A4_INDEX = 57

  const MINUS = 0
  const PLUS = 1

  const r = Math.pow(2.0, 1.0 / 12.0)
  const cent = Math.pow(2.0, 1.0 / 1200.0)
  let frequency = A4
  let r_index = 0
  let cent_index = 0
  let side: number | null = null

  if (input >= frequency) {
    while (input >= r * frequency) {
      frequency = r * frequency
      r_index++
    }
    while (input > cent * frequency) {
      frequency = cent * frequency
      cent_index++
    }
    if (cent * frequency - input < input - frequency) cent_index++
    if (cent_index > 50) {
      r_index++
      cent_index = 100 - cent_index
      if (cent_index != 0) side = MINUS
      else side = PLUS
    } else side = PLUS
  } else {
    while (input <= frequency / r) {
      frequency = frequency / r
      r_index--
    }
    while (input < frequency / cent) {
      frequency = frequency / cent
      cent_index++
    }
    if (input - frequency / cent < frequency - input) cent_index++
    if (cent_index >= 50) {
      r_index--
      cent_index = 100 - cent_index
      side = PLUS
    } else {
      if (cent_index != 0) side = MINUS
      else side = PLUS
    }
  }

  return {
    note: notes[A4_INDEX + r_index],
    side: side === PLUS ? 'plus' : 'minus',
    cent: cent_index,
  }
}

export const convertBufferToNotes = async (buffer: ArrayBuffer) => {
  try {
    const audioBuffer = await new AudioContext().decodeAudioData(buffer);
    let [quant, temp] = audioToMelody(audioBuffer.getChannelData(0));
    const pitches = PitchFinder.frequencies(
      [YIN(), AMDF()],
      await audioBuffer.getChannelData(0), // get a single channel of sound
      {
        tempo: temp, // in BPM, defaults to 120
        quantization: quant, // samples per beat, defaults to 4 (i.e. 16th notes)
      },
    )

    return pitches.reduce((notes, tone) => {
      if (tone === null) return notes
      return [...notes, frequencyToNote(tone)]
    }, [] as ReturnType<typeof frequencyToNote>[])
  } catch (error) {
    throw Error('pitch-finder: Failed to convert notes')
  }
}
