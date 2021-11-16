const audioContext = new AudioContext()


const whisper = 0.02

let numBeats = 0
let numDrums = 0
let minInterval = 125 //smallest interval between beats in milliseconds
let tempo = 60000 / minInterval 

export const drumArrays = []
const soundSettings = []
const defaultSounds = [[10000, 0.1, 0.1, 0.01, 1, 250, 0.1, 0.005, 0.01, 0.3],
                              [2500, 0.1, 0.1, 0.1, 1, 250, 0.1, 0.1, 0.01, 1],
                              [0, 0, 0, 0.01, 0, 250, 0.2, 0.2, 0.0001, 1]]


const sleepFor = delay => new Promise(resolve => setTimeout(resolve, delay))




// _________Functions to Access_________


//This event listener waits for a file to uploaded and then it determines the tempo of that audio file.
//It also converts the beats in that audio file into a patter than is pushed into drumArrays
export const handleOnChange = async ({ target }) => {
    console.log("here")
    //Store raw audio data in url object
    const file = target.files[0] 
    const url = URL.createObjectURL(file)
  
    //request data from the url object and store in a buffer
    const response = await fetch(url)
    const soundBuffer = await response.arrayBuffer()
  
    //pass buffer to the audioContext function decodeAudioData to get usable data
    const dataBuffer = await audioContext.decodeAudioData(soundBuffer)
  
    //get first channel. Channels represent different sources of audio. Like surround sound
    //That function return a vector of audio data 
    const audioData = dataBuffer.getChannelData(0)
  
    audioToDrum(audioData)
  }
  





  //This function is called to return the most common interval found in the audio file
//This is then used to determine the bpm
export function getBPM() {
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
  
    const intervalCats = []
    const intervalRanks = []
  
    intervalCats.push(intervals.pop())
    intervalRanks.push(1)
  
    while (intervals.length > 0) {
      let i = 0
      for (; i < intervalCats.length; i++) {
  
        if (intervalCats[i] == intervals[intervals.length - 1]) {
          intervalRanks[i]++
          intervals.pop()
          break
        }
      }
  
      if (i == intervalCats.length) {
        intervalCats.push(intervals.pop())
        intervalRanks.push(1)
      }
    }
  
    let maxRank = 0
    let commonInterval = null
    for (let i = 0; i < intervalRanks.length; i++) {
      if (intervalRanks[i] > maxRank) {
        maxRank = intervalRanks[i]
        commonInterval = intervalCats[i]
      }
    }
  
    tempo = 60000 / (commonInterval * minInterval)
}





export function addDrum() {
    const drumPattern = new Array(numBeats).fill(0)
    soundSettings.push(defaultSounds[drumArrays.length])
    drumArrays.push(drumPattern)
    numDrums++
}

export function deleteDrum(drumIndex) {
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

export function minusBeat() {
    for (let i = 0; i < drumArrays.length; i++) {
      drumArrays[i].pop()
    }
    numBeats--
}

export function shiftRight(drumIndex) {
    drumArrays[drumIndex].unshift(0)
    drumArrays[drumIndex].pop()
}

export function shiftLeft(drumIndex) {
    drumArrays[drumIndex].shift()
    drumArrays[drumIndex].push(0)
}


let run

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


export function playSound(setting) {
    
    let noiseFreq = setting[0]
    let noiseGain = setting[1]
    let noiseTime = setting[2]
    let noiseRamp = setting[3]
    let noiseVol = setting[4]
    let oscilFreq = setting[5]
    let oscilGain = setting[6]
    let oscilTime = setting[7]
    let oscilRamp = setting[8]
    let oscilVol = setting[9]
  
    const Filter = audioContext.createBiquadFilter()
    Filter.type = 'highpass'
    Filter.frequency.value = noiseFreq
    Filter.connect(primaryGainControl)
  
    const whiteNoiseSource = audioContext.createBufferSource()
    whiteNoiseSource.buffer = buffer
  
    const whiteNoiseSourceGain = audioContext.createGain()
    whiteNoiseSourceGain.gain.setValueAtTime(noiseVol, audioContext.currentTime)
    whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
      noiseRamp,
      audioContext.currentTime + noiseGain,
    )
  
    whiteNoiseSource.connect(whiteNoiseSourceGain)
    whiteNoiseSource.connect(Filter)
  
    whiteNoiseSource.start()
    whiteNoiseSource.stop(audioContext.currentTime + noiseTime)
  
    //create a simple oscillator with the disired wave type and
    //Set the frequency to whatever value at the beginning of the sound
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(oscilFreq, audioContext.currentTime)
  
    //create a gain (input volume) controler. Use the exponentialRampToValueAtTime
    //function to dampen the volume overtime 
    const oscillatorGain = audioContext.createGain()
    oscillatorGain.gain.setValueAtTime(oscilVol, audioContext.currentTime)
    oscillatorGain.gain.exponentialRampToValueAtTime(
      oscilRamp,//ramp to this value
      audioContext.currentTime + oscilGain,//get there at this time
    )
  
    //Connect oscillator to the gain controler audio moduel 
    //and the primaryGainControl (made earlier in the code)
    oscillator.connect(oscillatorGain)
    oscillatorGain.connect(primaryGainControl)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + oscilTime)
}




//__________ Supporting Functions _____________


function audioToDrum(audioData) {
    const length = audioData.length
    const rhythmData = []
    const labels = []
    const beats = []
  
    //These for loops iterate through the raw audio data looking
    //for the start of beat by searching for volume value greater
    //than the predetermined value for background noise. The let i
    // must maintained though out the nested for loops.
  
    for (let i = 0; i < length; i++) {
      if (audioData[i] > whisper) {
        rhythmData.push(1)
        let current = i
        beats.push(i)
        //This for loop is used to jump ahead by about 1/8 of a second to
        //skip the rest of the sound for that beat. Using a for loop for
        //this is only necessary for generating the chart. In the end I wont
        //need it and it can be replaced by adding 5000 to i.
        for (i = current; i < current + 5000; i++) {
          rhythmData.push(0)
          labels.push(i)
        }
      } else {
        //this part of the if statement is also only need for generating
        //data for the chart. In the end the only thing from this
        //for loop that is needed is the index of each beat.
        rhythmData.push(0)
        labels.push(i)
      }
    }
  
    const intervals = []
    for (let i = 0; i < beats.length - 1; i++) {
      intervals.push(beats[i + 1] - beats[i])
    }
  
    //minInterval is used to set the amount of time between playing each
    //tile on the drum machine.
    const interval = Math.min.apply(null, intervals) / 41
    if (interval < minInterval && numDrums > 0) {
      resetDrums(interval)
      minInterval = interval 
    } else if (numDrums == 0) {
      minInterval = interval
    }
  
    const newDrum = []
    for (let b = 0; b < beats.length - 1; b++) {
      newDrum.push(1)
      const space = parseInt((intervals[b] / (minInterval * 41)).toFixed())
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
    getBPM()
}



function resetDrums(interval) {
    const beatMult = parseInt((minInterval / interval).toFixed())
  
    for (let i = 0; i < numDrums; i++) {
      for (let j = numBeats; j > 0; j--) {
        for (let add = 0; add < beatMult - 1; add++) {
          drumArrays[i].splice(j, 0, 0)
        }
      }
    }
    numBeats = drumArrays[0].length
}



async function playBeat(beatI) {
    for (let i = 0; i < numDrums; i++) {
      const tile = drumArrays[i][beatI]
      if (tile != 0) {
        playSound(soundSettings[i])
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
  
//Making primary gain control and connecting it to
//desitination (The default audio out)
const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05, 0)
primaryGainControl.connect(audioContext.destination)
  
  
// __Snare__
  
function playSnare() {
  playSound([2500, 0.1, 0.1, 0.1, 1,
    250, 0.1, 0.1, 0.01, 1])
}
  
// ___Kick __
  
  
function playKick() {
  playSound([0, 0, 0, 0.01, 0,
    250, 0.2, 0.2, 0.0001, 1])
}
  
  // ___Hi Hat ____
  
function playHiHat() {
  playSound([10000, 0.1, 0.1, 0.01, 1,
    250, 0.1, 0.005, 0.01, 0.3])
}
