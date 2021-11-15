const audioContext = new AudioContext()

const recorder = document.getElementById('recorder')
const whisper = 0.02

export let numBeats = 0
export let numDrums = 0
export let minInterval = 125 //smallest interval between beats in milliseconds
export let tempo = 60000 / minInterval 


//This event listener waits for a file to uploaded and then it determines the tempo of that audio file.
//It also converts the beats in that audio file into a patter than is pushed into drumArrays
export const handleOnChange = async ({ target }) => {
  const file = target.files[0]
  const url = URL.createObjectURL(file)

  const response = await fetch(url)
  const soundBuffer = await response.arrayBuffer()
  const bpmBuffer = await audioContext.decodeAudioData(soundBuffer)

  const audioData = bpmBuffer.getChannelData(0)
  audioToDrum(audioData)
}

recorder.onchange = handleOnChange

export function audioToDrum(audioData) {
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

  drumArrays.push(newDrum)
  soundSettings.push(defaultSound)

  numDrums = drumArrays.length
  makeDrumMachine(numDrums, numBeats)

  getBPM()
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


//_________________Drum machine maker_____________________
//
//Each of these functions manipulates the 2d array that holds the patterns for each drum line in the
//drum machine. The machine starts out with no drums and no beats. You have to tell it to add them.

//this array will hold arrays that represent the drum machine
//pattern for each drum. I'm doing this to separate the creation
//and manipulation of the drum machine from dom manipulation
export const drumArrays = []
export const soundSettings = []
export const defaultSound = [2500, 0.1, 0.1, 0.1, 1, 250, 0.1, 0.1, 0.01, 1]

export function addDrum() {
  const drumPattern = new Array(numBeats).fill(0)
  drumArrays.push(drumPattern)
  soundSettings.push(defaultSound)
  numDrums++
  makeDrumMachine(numDrums, numBeats)
}

function minusDrum() {
  drumArrays.pop()
  numDrums--
  makeDrumMachine(numDrums, numBeats)
}

export function deleteDrum(drumIndex) {
  drumArrays.splice(drumIndex, 1)
  soundSettings.splice(drumIndex, 1)
  numDrums--
  makeDrumMachine(numDrums, numBeats)
}

export function addBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].push(0)
  }
  numBeats++
  makeDrumMachine(numDrums, numBeats)
}

export function minusBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].pop()
  }
  numBeats--
  makeDrumMachine(numDrums, numBeats)
}

export function shiftRight(drumIndex) {
  drumArrays[drumIndex].unshift(0)
  drumArrays[drumIndex].pop()
  makeDrumMachine(numDrums, numBeats)
}

export function shiftLeft(drumIndex) {
  drumArrays[drumIndex].shift()
  drumArrays[drumIndex].push(0)
  makeDrumMachine(numDrums, numBeats)
}

export function resetDrums(interval) {
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

const addBeatButton = document.getElementById('addBeat')
addBeatButton.onclick = () => {
  addBeat()
}

const remBeatButton = document.getElementById('remBeat')
remBeatButton.onclick = () => {
  minusBeat()
}

const addDrumButton = document.getElementById('addDrum')
addDrumButton.onclick = () => {
  addDrum()
}

//_________UI stuff__________________
//
//All the stuff in this section is just making buttons and stuff like that so I can
//test out my code.

//All of this dom manipulation is just to give me a way to visualize the drum machine and add beats
//from the website.
//The functions for manipulating the drum machine are above. The functions for playing the drum machine
//do not require these function bellow.

const machineContainer = document.getElementById('drums')

function makeDrumMachine(numDrums, numBeats) {
  //I'm deleting whatever was in the machine container before because
  //I create a new drum machine every time I edit the the parameters of it.
  while (machineContainer.firstChild) {
    machineContainer.removeChild(machineContainer.firstChild)
  }
  for (let i = 0; i < numDrums; i++) {
    new newDrumMachine(numBeats, i)
  }
}

function newDrumMachine(numBeats, index) {
  const lineBreak = document.createElement('br')

  //This will button calls the shiftLeft function. Its
  //faint because I don't know how to do UI
  const leftButton = document.createElement('button')
  leftButton.innerText = '<'
  leftButton.onclick = () => {
    shiftLeft(index)
  }

  //This button will call the shiftRight function
  const rightButton = document.createElement('button')
  rightButton.innerText = '>'
  rightButton.onclick = () => {
    shiftRight(index)
  }

  //This is to make a button that can remove specific drums from
  //The machine. The button is at the end of each drum line
  const deleteButton = document.createElement('button')
  deleteButton.innerText = 'DEL'
  deleteButton.onclick = () => {
    deleteDrum(index)
  }

  machineContainer.appendChild(leftButton)

  this.newDrumMachine = document.createElement('dev')
  this.newDrumMachine.setAttribute('id', 'drum' + index)
  machineContainer.appendChild(this.newDrumMachine)

  for (let i = 0; i < numBeats; i++) {
    new newDrum(this.newDrumMachine, i, index)
  }

  machineContainer.appendChild(rightButton)
  machineContainer.appendChild(deleteButton)
  machineContainer.appendChild(lineBreak)
}

function newDrum(drum, beatIndex, drumIndex) {
  this.newDrum = document.createElement('button')
  this.newDrum.setAttribute('id', 'beat' + drumIndex + beatIndex)
  this.newDrum.setAttribute('class', 'beat')

  //This if statement loads whatever is in the drumArrays onto the
  //drum machine visualizer.
  if (drumArrays[drumIndex][beatIndex] == 1) {
    this.newDrum.classList.add('beat-selected')
    this.newDrum.clicked = true
  }

  drum.appendChild(this.newDrum)

  this.newDrum.onclick = () => {
    if (!this.newDrum.clicked) {
      this.newDrum.classList.add('beat-selected')
      this.newDrum.clicked = true
      drumArrays[drumIndex][beatIndex] = 1 //This makes it so the buttons on the website can edit the drum machine pattern
    } else {
      this.newDrum.classList.remove('beat-selected')
      this.newDrum.clicked = false
      drumArrays[drumIndex][beatIndex] = 0 //Same here
    }
  }
}

//________Loop Section ______________

export const sleepFor = delay => new Promise(resolve => setTimeout(resolve, delay))

const play = document.getElementById('play')
const pause = document.getElementById('pause')
play.onclick = () => {
  playTrack()
}

export async function playTrack() {
  let run = true
  while (run) {
    pause.onclick = () => {
      run = false
    }

    for (let i = 0; i < numBeats; i++) {
      if (!run) {
        break
      }
      await sleepFor(minInterval)
      playBeat(i)
    }
  }
}

export async function playBeat(beatI) {
  for (let i = 0; i < numDrums; i++) {
    const tile = drumArrays[i][beatI]
    if (tile != 0) {
      playSound(soundSettings[i])
    }
  }
}

// _________Sounds Section ___________
//
//I will probably either import sounds or create a thing that allows
//you to easily make your own, but either way it likely wont stay as just a kick,
//snare, and hi hat sound.

export const buffer = audioContext.createBuffer(
  1,
  audioContext.sampleRate * 1,
  audioContext.sampleRate,
)

export const channelData = buffer.getChannelData(0)

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1
}

export const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05, 0)
primaryGainControl.connect(audioContext.destination)


// __Snare__

const snareButton = document.createElement('button')
snareButton.innerText = 'Snare'

snareButton.addEventListener('click', () => {
  playSnare()
})

export function playSnare() {
  playSound([2500, 0.1, 0.1, 0.1, 1,
    250, 0.1, 0.1, 0.01, 1])
}
document.querySelector('body').appendChild(snareButton)

// ___Kick __

const kickButton = document.createElement('button')

kickButton.addEventListener('click', () => {
  playKick()
})

export function playKick() {
  playSound([0, 0, 0, 0.01, 0,
    250, 0.2, 0.2, 0.0001, 1])
}
kickButton.innerText = 'Kick'
document.querySelector('body').appendChild(kickButton)

// ___Hi Hat ____

const hiHatButton = document.createElement('button')
hiHatButton.innerText = 'Hi Hat'

hiHatButton.addEventListener('click', () => {
  playHiHat()
})

export function playHiHat() {
  playSound([10000, 0.1, 0.1, 0.01, 1,
    250, 0.1, 0.005, 0.01, 0.3])
}
document.querySelector('body').appendChild(hiHatButton)



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

  const oscillator = audioContext.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(oscilFreq, audioContext.currentTime)

  const oscillatorGain = audioContext.createGain()
  oscillatorGain.gain.setValueAtTime(oscilVol, audioContext.currentTime)
  oscillatorGain.gain.exponentialRampToValueAtTime(
    oscilRamp,
    audioContext.currentTime + oscilGain,
  )

  oscillator.connect(oscillatorGain)
  oscillatorGain.connect(primaryGainControl)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + oscilTime)
}
