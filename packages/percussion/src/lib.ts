import {
  audioToDrum,
  drumArrays,
  getCommonInterval,
  minInterval,
  playBeat,
  sleepFor,
} from './helper'


const audioContext = new AudioContext()

// _________Functions to Access_________

// This event listener waits for a file to uploaded and then it determines the tempo of that audio file.
// It also converts the beats in that audio file into a patter than is pushed into drumArrays
export const inputAudioFile = async (file: File) => {
  const soundBuffer = await file.arrayBuffer()

  // pass buffer to the audioContext function decodeAudioData to get usable data
  const dataBuffer = await audioContext.decodeAudioData(soundBuffer)

  // get first channel. Channels represent different sources of audio. Like surround sound
  // That function return a vector of audio data
  const audioData = dataBuffer.getChannelData(0)

  audioToDrum(audioData)
}

// This function returns the BPM of the current drum machine recodings
export function getDrumBPM() {
  const intervals = []


  //These for loops iterate through the drum patterns recoding interval length
  //inbtween beats. The intervals are measured in incriments of minInterval. The 
  //variable count there to make sure intervals are only counted while the beat is palying.
  //The variable intCount is used to keep track of the number of minIntervals inbeteen each beat.
  //It starts as 1 because if there is a beat at the next tile that would be an interval of 1
  let intCount = 1
  let count = 0
  for (let i = 0; i < drumArrays.length; i++) {
    for (let j = 1; j < drumArrays[0].length; j++) {
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

  //it returns the tempo in BPM by dividing 60 by the seconds per beat.
  //The seconds per beat are found by multiplying most common interval by 
  //minInterval in seconds. getCommonInterval finds the most common interval 
  //(represented in # of minIntervals) in the audioData
  return 60 / ((minInterval / 1000) * getCommonInterval(intervals))
}

//adds a new drum line to the drumArrays that has no beats in it
export function addDrum() {
  const drumPattern = new Array(drumArrays[0].length).fill(0)
  drumArrays.push(drumPattern)
}

//removes a specific drum line from the drum machine
export function removeDrum(drumIndex: number) {
  drumArrays.splice(drumIndex, 1)
}

//adds 1 beat to the end of every drum line
export function addBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].push(0)
  }
}

//removes 1 beat from the end of every drum line
export function removeBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].pop()
  }
}

//shifts the pattern right
export function shiftRight(drumIndex: number) {
  drumArrays[drumIndex].unshift(0)
  drumArrays[drumIndex].pop()
}

//shifts the pattern left
export function shiftLeft(drumIndex: number) {
  drumArrays[drumIndex].shift()
  drumArrays[drumIndex].push(0)
}

//used to determine if the drum machine should be playing
let run = false

//This starts the drum machine loop playing until it is told
//otherwise
export async function playTrack() {
  run = true

  //This while loop tells each beat in the drum macine to play in order and 
  //wait for the correct amount of time before playing the next
  while (run) {
    for (let i = 0; i < drumArrays[0].length; i++) {
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

export { drumArrays }
