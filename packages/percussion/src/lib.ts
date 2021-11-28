const audioContext = new AudioContext()

const whisper = 0.02

let numBeats = 0
let numDrums = 0
let minInterval = 125 // smallest interval between beats in milliseconds

// AB - boolean ??
export const drumArrays: (0 | 1)[][] = []
const soundSettings = []
const defaultSounds = [
  [10000, 0.1, 0.1, 0.01, 1, 250, 0.1, 0.005, 0.01, 0.3],
  [2500, 0.1, 0.1, 0.1, 1, 250, 0.1, 0.1, 0.01, 1],
  [0, 0, 0, 0.01, 0, 250, 0.2, 0.2, 0.0001, 1],
]

const sleepFor = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))

// _________Functions to Access_________

// This event listener waits for a file to uploaded and then it determines the tempo of that audio file.
// It also converts the beats in that audio file into a patter than is pushed into drumArrays
export const inputAudioFile = async (file: File) => {
  const soundBuffer = await file.arrayBuffer()

  if (import.meta.env.DEV) console.log(soundBuffer)

  // pass buffer to the audioContext function decodeAudioData to get usable data
  const dataBuffer = await audioContext.decodeAudioData(soundBuffer)

  // get first channel. Channels represent different sources of audio. Like surround sound
  // That function return a vector of audio data
  const audioData = dataBuffer.getChannelData(0)
  if (import.meta.env.DEV) console.log(audioData)

  if (import.meta.env.DEV) console.log(audioContext.sampleRate)
  audioToDrum(audioData)
}

// This function is called to return the most common interval found in the audio file
// This is then used to determine the bpm
export function getDrumBPM() {
  const intervals = []

  let intCount = 1
  let count = 0
  for (let i = 0; i < numDrums; i++) {
    for (let j = 1; j < numBeats; j++) {
      if (drumArrays[i][j] == 1 && count == 1) {
        intervals.push(intCount)
        intCount = 0
      } else if (drumArrays[i][j] == 1 && count == 0) {
        count = 1
        intCount = 0
      }
      intCount += count
    }
    count = 0
    intCount = 0
  }
}

export function addDrum() {
  const drumPattern = new Array(numBeats).fill(0)
  soundSettings.push(defaultSounds[drumArrays.length])
  drumArrays.push(drumPattern)
  numDrums++
}

export function removeDrum(drumIndex: number) {
  drumArrays.splice(drumIndex, 1)
  soundSettings.splice(drumIndex, 1)
  numDrums--
}

export function addBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].push(0)
  }
  numBeats++
}

export function removeBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].pop()
  }
  numBeats--
}

export function shiftRight(drumIndex: number) {
  drumArrays[drumIndex].unshift(0)
  drumArrays[drumIndex].pop()
}

export function shiftLeft(drumIndex: number) {
  drumArrays[drumIndex].shift()
  drumArrays[drumIndex].push(0)
}

let run = false

export async function playTrack() {
  run = true
  while (run) {
    for (let i = 0; i < numBeats; i++) {
      if (!run) {
        break
      }
      await sleepFor(minInterval)
      playBeat(i)
    }
  }
}

export function pauseTrack() {
  run = false
}

// AB - settings would probably be better as an object here

interface AudioNodeConfig {
  frequency: number
  gain: number
  time: number
  ramp: number
  volume: number
}
interface SoundSettings {
  noise: AudioNodeConfig
  oscillation: AudioNodeConfig
}

// AB - can use like this -- export function playSound(setting: Settings) {
export function playSound(setting) {
  const noiseFreq = setting[0]
  const noiseGain = setting[1]
  const noiseTime = setting[2]
  const noiseRamp = setting[3]
  const noiseVol = setting[4]
  const oscillationFreq = setting[5]
  const oscillationGain = setting[6]
  const oscillationTime = setting[7]
  const oscillationRamp = setting[8]
  const oscillationVol = setting[9]

  const filter = audioContext.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = noiseFreq
  filter.connect(primaryGainControl)

  const whiteNoiseSource = audioContext.createBufferSource()
  whiteNoiseSource.buffer = buffer

  const whiteNoiseSourceGain = audioContext.createGain()
  whiteNoiseSourceGain.gain.setValueAtTime(noiseVol, audioContext.currentTime)
  whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
    noiseRamp,
    audioContext.currentTime + noiseGain
  )

  whiteNoiseSource.connect(whiteNoiseSourceGain)
  whiteNoiseSource.connect(filter)

  whiteNoiseSource.start()
  whiteNoiseSource.stop(audioContext.currentTime + noiseTime)

  // create a simple oscillator with the desired wave type and
  // Set the frequency to whatever value at the beginning of the sound
  const oscillator = audioContext.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(oscillationFreq, audioContext.currentTime)

  // create a gain (input volume) controller. Use the exponentialRampToValueAtTime
  // function to dampen the volume overtime
  const oscillatorGain = audioContext.createGain()
  oscillatorGain.gain.setValueAtTime(oscillationVol, audioContext.currentTime)
  oscillatorGain.gain.exponentialRampToValueAtTime(
    oscillationRamp, // ramp to this value
    audioContext.currentTime + oscillationGain // get there at this time
  )

  // Connect oscillator to the gain controller audio module
  // and the primaryGainControl (made earlier in the code)
  oscillator.connect(oscillatorGain)
  oscillatorGain.connect(primaryGainControl)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + oscillationTime)
}

// __________ Supporting Functions _____________

/////////////////////////////////////////////////////////////////////////////////////////
// _________ Functions for getting the tempo and quantization of hummed melodies__________

//This is a helper function for the audioToMelody Function.
//It takes an array of values that represent intervals between each note in the recording.
//The interval values are expressed in multiples of the smallest interval in the recording.
//So a 1 in the array would represent an interval time of 1 * the smallest interval
//It returns the most common beat interval that the tempo will be based on
function getCommonInterval(intervals) {
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
const ave = arr =>
  arr.reduce((a, b) => Math.abs(a) + Math.abs(b), 0) / arr.length

//This function takes the a vector of audio data and calculates the
//quantization value and the tempo. At the moment this is all it does, but
//it can be made to produce a vector that describes when a note should be played
//and for how long.
function audioToMelody(audioData: Float32Array) {
  const length = audioData.length

  //minStep is the period of time in-between the peaks of
  //the minFreq. It is represented in the number of elements
  //in the audio data that span that time
  const minStep = audioContext.sampleRate / minFreq

  //quantLen will store the shortest interval in the audio data.
  //In other words it is the duration of one beat according to whatever
  //the quantization value is
  let quantLen = length

  const notes = [] //stores the index at which notes start
  let note = false //tells the for loop if a note is currently playing
  let step //holds the values within the range of minStep

  //This for loop iterates through the audioData minStep elements at a time
  //It records the index of the start of each note
  for (let i = 0; i < length; i += minStep) {
    step = audioData.slice(i, i + minStep) //get the next minStep worth of elements

    //If a note was not already playing and the amplitude is higher than minAmp
    //Then record the start of a note and tell the note variable that a note is now playing
    if (!note && ave(step) > minAmp) {
      notes.push(i)
      note = true
    }
    //else if a note is currently playing and the amplitude drops bellow minAmp
    //Then tell the note variable that the note is no longer playing
    else if (note && ave(step) < minAmp) {
      note = false
    }
  }

  const intervals = [] //This stores the intervals between the start of each note
  let interval: number //holds the current interval length

  //This for loop iterates of the notes vector to find the shortest interval between
  //the start of two notes. The shortest interval, or quantLen, has to be found before recording all of
  //the intervals between notes because the intervals are recorded as multiples of the shortest interval
  for (let i = 0; i < notes.length - 1; i++) {
    interval = notes[i + 1] - notes[i]
    if (interval < quantLen) {
      quantLen = interval
    }
  }

  //This for loop iterates over the notes vector calculating and recording the interval
  //length between the start of each note
  for (let i = 0; i < notes.length - 1; i++) {
    //calculate and record the current interval as an integer multiple of the
    //shortest interval. Recoding the intervals this way makes finding the most
    //common interval significantly easier and more standardized
    interval = notes[i + 1] - notes[i]
    intervals.push(parseInt((interval / quantLen).toFixed()))
  }

  //convert the quantLen from number of elements to time in seconds
  quantLen /= audioContext.sampleRate

  //quant is the quantization value. The getCommonInterval function returns the number of shortest
  //interval lengths that make up the most common interval. In other words it is the beats for
  //each whole note. It may be a good idea to pass 2 * quant as the quantization value, that way
  //a note that is hummed twice quickly can be registered as two distinct sounds rather than one
  //continuous one.
  const quant = getCommonInterval(intervals)

  //tempo is expressed in beats per minute. quantLen * quant is the amount of
  //time for a whole note in seconds (seconds/beat). Dividing 60 seconds by this value
  //gets beats/minute
  const tempo = 60 / (quantLen * quant)

  if (import.meta.env.DEV) console.log(quant)
  if (import.meta.env.DEV) console.log(tempo)
}

if (import.meta.env.DEV) console.log(import.meta.env)
//////////////////////////////////////////////////////////////////////
//____________End of functions for getting quantization and tempo for melodies//
//////////////////////////////////////////////////////////////////////

function audioToDrum(audioData: Float32Array) {
  const length = audioData.length
  const rhythmData = []
  const beats = []

  // These for loops iterate through the raw audio data looking
  // for the start of beat by searching for volume value greater
  // than the predetermined value for background noise. The let i
  // must maintained though out the nested for loops.

  for (let i = 0; i < length; i++) {
    if (audioData[i] > whisper) {
      rhythmData.push(1)
      const current = i
      beats.push(i)
      // This for loop is used to jump ahead by about 1/8 of a second to
      // skip the rest of the sound for that beat. Using a for loop for
      // this is only necessary for generating the chart. In the end I wont
      // need it and it can be replaced by adding 5000 to i.
      for (i = current; i < current + 5000; i++) {
        rhythmData.push(0)
      }
    } else {
      // this part of the if statement is also only need for generating
      // data for the chart. In the end the only thing from this
      // for loop that is needed is the index of each beat.
      rhythmData.push(0)
    }
  }

  const intervals = []
  for (let i = 0; i < beats.length - 1; i++) {
    intervals.push(beats[i + 1] - beats[i])
  }

  // minInterval is used to set the amount of time between playing each
  // tile on the drum machine.
  // AB - Math.min(..intervals) ??? -- gets the smallest value in an array
  const interval =
    Math.min.apply(null, intervals) / (audioContext.sampleRate / 1000)
  if (interval < minInterval && numDrums > 0) {
    resetDrums(interval)
    minInterval = interval
  } else if (numDrums == 0) {
    minInterval = interval
  }

  const newDrum = []
  for (let b = 0; b < beats.length - 1; b++) {
    newDrum.push(1)
    const space = parseInt(
      (
        intervals[b] /
        (minInterval * (audioContext.sampleRate / 1000))
      ).toFixed()
    )
    for (let i = 0; i < space - 1; i++) {
      newDrum.push(0)
    }
  }

  if (newDrum.length > numBeats) {
    for (let i = 0; i < newDrum.length - numBeats; i++) {
      for (let j = 0; j < numDrums; j++) {
        drumArrays[j].push(0)
      }
    }
    numBeats = newDrum.length
  } else if (newDrum.length < numBeats) {
    const diff = numBeats - newDrum.length
    for (let i = 0; i < diff; i++) {
      newDrum.push(0)
    }
  }

  soundSettings.push(defaultSounds[drumArrays.length])
  drumArrays.push(newDrum)

  numDrums = drumArrays.length
  getDrumBPM()
}

function resetDrums(interval: number) {
  const beatMultiplier = parseInt((minInterval / interval).toFixed())

  for (let i = 0; i < numDrums; i++) {
    for (let j = numBeats; j > 0; j--) {
      for (let add = 0; add < beatMultiplier - 1; add++) {
        drumArrays[i].splice(j, 0, 0)
      }
    }
  }
  numBeats = drumArrays[0].length
}

async function playBeat(beatIndex: number) {
  for (let i = 0; i < numDrums; i++) {
    const tile = drumArrays[i][beatIndex]
    if (tile != 0) {
      playSound(soundSettings[i])
    }
  }
}

const buffer = audioContext.createBuffer(
  1,
  audioContext.sampleRate * 1,
  audioContext.sampleRate
)

const channelData = buffer.getChannelData(0)

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1
}

// Making primary gain control and connecting it to
// destination (The default audio out)
const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05, 0)
primaryGainControl.connect(audioContext.destination)

// __Snare__

const snareSoundObject: SoundSettings = {
  noise: {
    frequency: 2500,
    gain: 0.1,
    time: 0.1,
    ramp: 0.1,
    volume: 1,
  },
  oscillation: {
    frequency: 250,
    gain: 0.1,
    time: 0.1,
    ramp: 0.01,
    volume: 1,
  },
}

const snareSoundArray = [2500, 0.1, 0.1, 0.1, 1, 250, 0.1, 0.1, 0.01, 1]

export function playSnare() {
  playSound(snareSoundArray)
}

// ___Kick __

export function playKick() {
  playSound([0, 0, 0, 0.01, 0, 250, 0.2, 0.2, 0.0001, 1])
}

// ___Hi Hat ____

export function playHiHat() {
  playSound([10000, 0.1, 0.1, 0.01, 1, 250, 0.1, 0.005, 0.01, 0.3])
}
