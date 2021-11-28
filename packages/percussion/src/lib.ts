import {
  minInterval,
  drumArrays,
  sleepFor,
  getCommonInterval,
  audioToDrum,
  SoundSettings,
  playBeat
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


// This function is called to return the most common interval found in the audio file
// This is then used to determine the bpm
export function getDrumBPM() {
  const intervals = []

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

  return 60 / ((minInterval / 1000) * getCommonInterval(intervals))
}

export function addDrum() {
  const drumPattern = new Array(drumArrays[0].length).fill(0)
  drumArrays.push(drumPattern)
}

export function removeDrum(drumIndex: number) {
  drumArrays.splice(drumIndex, 1)
}

export function addBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].push(0)
  }
}

export function removeBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].pop()
  }
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


