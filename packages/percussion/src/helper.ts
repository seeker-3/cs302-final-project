
const audioContext = new AudioContext

interface AudioNodeConfig {
    frequency: number
    gain: number
    time: number
    ramp: number
    volume: number
}
export interface SoundSettings {
    noise: AudioNodeConfig
    oscillation: AudioNodeConfig
}

const whisper = 0.02

export let minInterval = 250 // smallest interval between beats in milliseconds

export const drumArrays: (0 | 1)[][] = []

export const sleepFor = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))


export function getCommonInterval(intervals: Array<number>) {
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
  

export function audioToDrum(audioData: Float32Array) {
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
    if (interval < minInterval && drumArrays.length > 0) {
      resetDrums(interval)
      minInterval = interval
    } else if (drumArrays.length == 0) {
      minInterval = interval
    }
  
    const newDrum = []
    for (let b = 0; b < beats.length - 1; b++) {
      newDrum.push(1)
      const space = parseInt(
        (
          intervals[b] /
          (minInterval * (audioContext.sampleRate / 1000))
        ).toFixed(),
      )
      for (let i = 0; i < space - 1; i++) {
        newDrum.push(0)
      }
    }
    
    if (drumArrays.length > 0) {

      if (newDrum.length > drumArrays[0].length) {
        for (let i = 0; i < newDrum.length - drumArrays[0].length; i++) {
          for (let j = 0; j < drumArrays.length; j++) {
            drumArrays[j].push(0)
          }
        }
      } else if (newDrum.length < drumArrays[0].length) {
        const diff = drumArrays[0].length - newDrum.length
        for (let i = 0; i < diff; i++) {
          newDrum.push(0)
        }
      }
    }
    
    drumArrays.push(newDrum)
  
    getDrumBPM()
}


export function resetDrums(interval: number) {
    const beatMultiplier = parseInt((minInterval / interval).toFixed())
  
    for (let i = 0; i < drumArrays.length; i++) {
      for (let j = drumArrays[0].length; j > 0; j--) {
        for (let add = 0; add < beatMultiplier - 1; add++) {
          drumArrays[i].splice(j, 0, 0)
        }
      }
    }
}





//Functions for playing sounds//////////////////
///////////////////////////////////////////////

export async function playBeat(beatIndex: number) {
    for (let i = 0; i < drumArrays.length; i++) {
      const tile = drumArrays[i][beatIndex]
      if (tile != 0) {
        if (i == 0) {
        playHiHat()
        }
        else if (i == 1) {
          playSnare()
        }
        else if (i == 2) {
          playKick()
        }
      }
    }
}
  
const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate,
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
      gain: 0.05,
      time: 0.05,
      ramp: 0.1,
      volume: .7,
    },
    oscillation: {
      frequency: 350,
      gain: 0.05,
      time: 0.05,
      ramp: 0.005,
      volume: 1,
    },
}
    
export function playSnare() {
    playSound(snareSoundObject)
}
  
  // ___Kick __
  
  const kickSoundObject: SoundSettings = {
    noise: {
      frequency: 0,
      gain: 0,
      time: 0,
      ramp: 0.001,
      volume: 0,
    },
    oscillation: {
      frequency: 60,
      gain: 0.005,
      time: 0.02,
      ramp: 2,
      volume: 1,
    },
  }
  
  
export function playKick() {
    playSound(kickSoundObject)
}
  
  // ___Hi Hat ____
  
  
  const hihatSoundObject: SoundSettings = {
    noise: {
      frequency: 10000,
      gain: 0.1,
      time: 0.1,
      ramp: 0.01,
      volume: 1,
    },
    oscillation: {
      frequency: 250,
      gain: 0.1,
      time: 0.005,
      ramp: 0.01,
      volume: 0.3,
    },
  }
  
  export function playHiHat() {
    playSound(hihatSoundObject)
  }
  

export function playSound(sound: SoundSettings) {

    const filter = audioContext.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = sound.noise.frequency
    filter.connect(primaryGainControl)
  
    const whiteNoiseSource = audioContext.createBufferSource()
    whiteNoiseSource.buffer = buffer
  
    const whiteNoiseSourceGain = audioContext.createGain()
    whiteNoiseSourceGain.gain.setValueAtTime(sound.noise.volume, audioContext.currentTime)
    whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
      sound.noise.ramp,
      audioContext.currentTime + sound.noise.gain,
    )
  
    whiteNoiseSource.connect(whiteNoiseSourceGain)
    whiteNoiseSource.connect(filter)
  
    whiteNoiseSource.start()
    whiteNoiseSource.stop(audioContext.currentTime + sound.noise.time)
  
    // create a simple oscillator with the desired wave type and
    // Set the frequency to whatever value at the beginning of the sound
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(sound.oscillation.frequency, audioContext.currentTime)
  
    // create a gain (input volume) controller. Use the exponentialRampToValueAtTime
    // function to dampen the volume overtime
    const oscillatorGain = audioContext.createGain()
    oscillatorGain.gain.setValueAtTime(sound.oscillation.volume, audioContext.currentTime)
    oscillatorGain.gain.exponentialRampToValueAtTime(
      sound.oscillation.ramp, // ramp to this value
      audioContext.currentTime + sound.oscillation.gain, // get there at this time
    )
  
    // Connect oscillator to the gain controller audio module
    // and the primaryGainControl (made earlier in the code)
    oscillator.connect(oscillatorGain)
    oscillatorGain.connect(primaryGainControl)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + sound.oscillation.time)
}
  

  