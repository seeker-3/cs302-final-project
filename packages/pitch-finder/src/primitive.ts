import PitchFinder, { AMDF, YIN } from 'pitchfinder'
import notes from './notes'

// _________ Functions for getting the tempo and quantization of hummed melodies__________

//This is a helper function for the audioToMelody Function.
//It takes an array of values that represent intervals between each note in the recording.
//The interval values are expressed in multiples of the smallest interval in the recording.
//So a 1 in the array would represent an interval time of 1 * the smallest interval
//It returns the most common beat interval that the tempo will be based on
function getCommonInterval(intervals: number[]) {
  const intervalCats = [] //this will hold the catagories of interval length
  const intervalRanks = [] //this will hold the number of occurrences for each category

  //record the first interval type and add 1 to its rank
  intervalCats.push(intervals.pop())
  intervalRanks.push(1)

  //This while loop iterates until the intervals vector is exhausted
  while (intervals.length > 0) {
    let i = 0

    //This for loop iterates over the intervalCats until it finds a match for the
    //current interval
    for (; i < intervalCats.length; i++) {
      //if a match is found then pop that interval off the intervals vector
      //and add one to its category rank. Then break to stop the search
      if (intervalCats[i] == intervals[intervals.length - 1]) {
        intervalRanks[i]++
        intervals.pop()
        break
      }
    }

    //if no match was found then pop off the interval from the intervals vector
    //and add it to the intervalCats to make a new category of interval. set its
    //rank to 1
    if (i == intervalCats.length) {
      intervalCats.push(intervals.pop())
      intervalRanks.push(1)
    }
  }

  let maxRank = 0
  let commonInterval = null

  //This for loop iterates over the interval ranks to find the most common occurrence
  for (let i = 0; i < intervalRanks.length; i++) {
    if (intervalRanks[i] > maxRank) {
      maxRank = intervalRanks[i]
      commonInterval = intervalCats[i]
    }
  }

  if (!commonInterval) {
    throw Error('common interval not found')
  }

  //return the most commonInterval as an integer that represent how many
  //shortest intervals it is long.
  return commonInterval
}

//These values are used to detect the areas where a note is being played.
// - minFreq is the smallest frequency that you are interested in detecting.
//   It is used to avoid detecting the silences in between peaks in a notes frequency
// - minAmp is the lowest volume at which a note will be detected.
//Both of these values can be changed to make the code work better if needed, but
//in my testing these values work quite well.
const minFreq = 20
const minAmp = 0.04

//I use this to get the average amplitude over a region of the audio data.
//This is important because it allows the us to avoid detecting the space in between
//the peaks of a note's frequency
const averageFloat32Array = (array: Float32Array) =>
  array.reduce((a, b) => Math.abs(a) + Math.abs(b), 0) / array.length

//This function takes the a vector of audio data and calculates the
//quantization value and the tempo. At the moment this is all it does, but
//it can be made to produce a vector that describes when a note should be played
//and for how long.
export const audioToMelody = (audioData: Float32Array, sampleRate: number) => {
  //minStep is the period of time in-between the peaks of
  //the minFreq. It is represented in the number of elements
  //in the audio data that span that time
  const minStep = sampleRate / minFreq

  //quantLen will store the shortest interval in the audio data.
  //In other words it is the duration of one beat according to whatever
  //the quantization value is
  let quantizationLength = audioData.length

  const notes = [] //stores the index at which notes start
  let note = false //tells the for loop if a note is currently playing

  //This for loop iterates through the audioData minStep elements at a time
  //It records the index of the start of each note
  for (let i = 0; i < quantizationLength; i += minStep) {
    // step holds the values within the range of minStep
    const step = audioData.slice(i, i + minStep) //get the next minStep worth of elements

    //If a note was not already playing and the amplitude is higher than minAmp
    //Then record the start of a note and tell the note variable that a note is now playing
    if (!note && averageFloat32Array(step) > minAmp) {
      notes.push(i)
      note = true
    }
    //else if a note is currently playing and the amplitude drops bellow minAmp
    //Then tell the note variable that the note is no longer playing
    else if (note && averageFloat32Array(step) < minAmp) {
      note = false
    }
  }

  const intervals = [] //This stores the intervals between the start of each note

  //This for loop iterates of the notes vector to find the shortest interval between
  //the start of two notes. The shortest interval, or quantLen, has to be found before recording all of
  //the intervals between notes because the intervals are recorded as multiples of the shortest interval
  for (let i = 0; i < notes.length - 1; i++) {
    // holds the current interval length
    const interval = notes[i + 1] - notes[i]
    if (interval < quantizationLength) {
      quantizationLength = interval
    }
  }

  //This for loop iterates over the notes vector calculating and recording the interval
  //length between the start of each note
  for (let i = 0; i < notes.length - 1; i++) {
    //calculate and record the current interval as an integer multiple of the
    //shortest interval. Recoding the intervals this way makes finding the most
    //common interval significantly easier and more standardized
    const interval = notes[i + 1] - notes[i]
    intervals.push(parseInt((interval / quantizationLength).toFixed()))
  }

  //convert the quantLen from number of elements to time in seconds
  quantizationLength /= sampleRate

  //quant is the quantization value. The getCommonInterval function returns the number of shortest
  //interval lengths that make up the most common interval. In other words it is the beats for
  //each whole note. It may be a good idea to pass 2 * quant as the quantization value, that way
  //a note that is hummed twice quickly can be registered as two distinct sounds rather than one
  //continuous one.
  const quantization = getCommonInterval(intervals)

  //tempo is expressed in beats per minute. quantLen * quant is the amount of
  //time for a whole note in seconds (seconds/beat). Dividing 60 seconds by this value
  //gets beats/minute
  const tempo = Math.round(60 / (quantizationLength * quantization));

  return { quantization, tempo }
}

//////////////////////////////////////////////////////////////////////////////////////
// Converts a frequency to its musical note equivalent with optional cent notation //
////////////////////////////////////////////////////////////////////////////////////
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

  notes[A4_INDEX + r_index]
  // side: side === PLUS ? 'plus' : 'minus',
  // cent: cent_index,
}

export type Notes = ReturnType<typeof frequencyToNote>

/////////////////////////////////////////////////////////////////////////////////////
// Converts a list of frequencies to their musical note equivalent and returns it //
///////////////////////////////////////////////////////////////////////////////////
export const convertBufferToNotes = async (buffer: ArrayBuffer) => {

  // Establish an AudioContext
  // Retrieve audio buffer buffer argument
  // Convert audio to "melody" e.g. find its tempo/quantization
  // Run pitch-finding algorithm

  try {
    const audioContext = new AudioContext()

    const audioChannel0 = (
      await audioContext.decodeAudioData(buffer)
    ).getChannelData(0)

    const melody = audioToMelody(audioChannel0, audioContext.sampleRate)

    const pitches = PitchFinder.frequencies(
      [YIN(), AMDF()],
      audioChannel0, // get a single channel of sound
      melody,
    )

    return pitches.reduce(
      (notes, tone) =>
        tone === null ? notes : [...notes, frequencyToNote(tone)],
      [] as Notes[],
    )
  } catch (error) {
    console.error(error)
    throw Error('pitch-finder: Failed to convert notes.')
  }
}
