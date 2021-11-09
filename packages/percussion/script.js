import './style.css'

const audioContext = new AudioContext()

const recorder = document.getElementById('recorder')
const whisper = 0.02

let numBeats = 0
let numDrums = 0
let minInterval = 125 //smallest interval between beats in milliseconds


//This event listener waits for a file to uploaded and then it determines the tempo of that audio file.
//It also converts the beats in that audio file into a patter than is pushed into drumArrays
recorder.addEventListener('change', async ({ target }) => {
  const file = target.files[0]
  const url = URL.createObjectURL(file)

  const response = await fetch(url)
  const soundBuffer = await response.arrayBuffer()
  const bpmBuffer = await audioContext.decodeAudioData(soundBuffer)

  const audioData = bpmBuffer.getChannelData(0)
  const length = audioData.length
  const rhythmData = []
  const labels = []
  const beats = []

  //These for loops iterate through the raw audio data looking
  //for the start of beat by searching for volume value greater 
  //than the predetermined value for background noise. The let i
  // must maintained though out the nested for loops.
  let i
  for (i = 0; i < length; i++) {
    if (audioData[i] > whisper) {
      rhythmData.push(1)
      let current = i
      beats.push(i)
      //This for loop is used to jump ahead by about 1/8 of a second to
      //skip the rest of the sound for that beat. Using a for loop for 
      //this is only nessesary for generating the chart. In the end I wont
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
  let sum = 0
  for (let i = 0; i < beats.length - 1; i++) {
    intervals.push(beats[i + 1] - beats[i])
    sum += beats[i + 1] - beats[i]
  }

  //minInterval is used to set the amount of time between playing each
  //tile on the drum machine. 
  minInterval = Math.min.apply(null, intervals) / 41


  //right here I'm getting each beat from the audio file and adding it to the drum machine pattern
  //with the appropiot number of spaces following based on the interval to the next beat
  let firstDrum = []
  for (let b = 0; b < beats.length-1; b++) {
    firstDrum.push(1);
    let space = (intervals[b] / (minInterval*41)).toFixed()
    for (let i = 0; i < space-1; i++) {
      firstDrum.push(0);
    }
  }

  //Adding the new drum pattern to drumArrays and making the drum machine again so it will be included 
  drumArrays.push(firstDrum)
  numDrums++;
  numBeats = firstDrum.length
  makeDrumMachine(numDrums, numBeats)

  const tempo = (60 / (sort(intervals) / 41000)).toFixed()
  
  document.querySelector(
    '#rec',
  ).innerHTML = `<h2> Your Temp is ${tempo} BPM</h2>`
})


//This function is called to return the most commom interval found in the audio file
//This is then used to determine the bpm
function sort(intervals) {
  const intervalCats = []
  const intervalRanks = []

  intervalCats.push(intervals.pop())
  intervalRanks.push(1)

  while (intervals.length > 0) {
    let i = 0
    for (i = 0; i < intervalCats.length; i++) {
      const diff = Math.abs(intervalCats[i] - intervals[intervals.length - 1])

      if (diff < intervalCats[i] / 2) {
        intervalCats[i] *= intervalRanks[i]
        intervalRanks[i]++

        intervalCats[i] += intervals.pop()
        intervalCats[i] /= intervalRanks[i]

        break
      }
    }

    if (i == intervalCats.length) {
      intervalCats.push(intervals.pop())
      intervalRanks.push(1)
    }
  }

  let maxRank = 0
  let commonInterval
  for (let i = 0; i < intervalRanks.length; i++) {
    if (intervalRanks[i] > maxRank) {
      maxRank = intervalRanks[i]
      commonInterval = intervalCats[i]
    }
  }

  return commonInterval
}


//This isnt important. I just used this to help visualize the audio data. 
//I may want to use it again in the future, so I havent deleted it yet
function makeChart(rhythmData, labels) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sound Data',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: rhythmData,
      },
    ],
  }

  const config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
        },
      },
    },
  }

  const myChart = new Chart(document.getElementById('myChart'), config)
}


//_________________Drum machine maker_____________________
//
//Each of these functions manipulates the 2d array that holds the patterns for each drumline in the 
//drum machine. The machine starts out with no drums and no beats. You have to tell it to add them. 

//this array will hold arrays that represent the drum machine
//pattern for each drum. I'm doing this to seperate the creation
//and manipulation of the drum machine from dom manipulation
let drumArrays = []

function addDrum() {
  let drumPattern = new Array(numBeats).fill(0)
  drumArrays.push(drumPattern)
  numDrums++
  makeDrumMachine(numDrums, numBeats)
}

function minusDrum() {
  drumArrays.pop()
  numDrums--
  makeDrumMachine(numDrums, numBeats)
}

function deleteDrum(drumIndex) {
  drumArrays.splice(drumIndex, 1)
  numDrums--
  makeDrumMachine(numDrums, numBeats)
}

function addBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].push(0)
  }
  numBeats++
  makeDrumMachine(numDrums, numBeats)
}

function minusBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].pop()
  }
  numBeats--
  makeDrumMachine(numDrums, numBeats)
}

function shiftRight(drumIndex) {
  drumArrays[drumIndex].unshift(0)
  drumArrays[drumIndex].pop()
  makeDrumMachine(numDrums, numBeats)
}

function shiftLeft(drumIndex) {
  drumArrays[drumIndex].shift()
  drumArrays[drumIndex].push(0)
  makeDrumMachine(numDrums, numBeats)
}


const addBeatButton = document.getElementById("addBeat")
addBeatButton.onclick = () => {
  addBeat()
}

const remBeatButton = document.getElementById("remBeat")
remBeatButton.onclick = () => {
  minusBeat()
}

const addDrumButton = document.getElementById("addDrum")
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
  //I create a new drum machine evertime I edit the the paramaters of it.
  while(machineContainer.firstChild) {
    machineContainer.removeChild(machineContainer.firstChild)
  }
  for (let i = 0; i < numDrums; i++) {
    new newDrumMachine(numBeats, i)
  }
}

function newDrumMachine(numBeats, index) {
  
  const lineBreak = document.createElement('br')


  //This will button calls the shiftLeft function. Its
  //faint becuase I don't know how to do UI
  const leftButton = document.createElement('buton')
  leftButton.innerText = '<'
  leftButton.onclick = () => {shiftLeft(index)}

  //This button will call the shiftRigt function
  const rightButton = document.createElement('button')
  rightButton.innerText = '>'
  rightButton.onclick = () => {shiftRight(index)}

  //This is to make a button that can remove specific drums from
  //The machine. The button is at the end of each drumline
  const deleteButton = document.createElement('button')
  deleteButton.innerText = 'DEL'
  deleteButton.onclick = () => {deleteDrum(index)}

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
      drumArrays[drumIndex][beatIndex] = 1//This makes it so the buttons on the website can edit the drum machine pattern
    } else {
      this.newDrum.classList.remove('beat-selected')
      this.newDrum.clicked = false
      drumArrays[drumIndex][beatIndex] = 0//Same here
    }
  }
}

//________Loop Section ______________

const sleepFor = delay => new Promise(resolve => setTimeout(resolve, delay))

const play = document.getElementById('play')
const pause = document.getElementById('pause')
play.onclick = () => {
  playTrack()
}

async function playTrack() {
  let run = true
  while (run) {
    pause.onclick = () => {
      run = false
    }

    for (let i = 0; i < numBeats; i++) {
      if(!run){break;}
      await sleepFor(minInterval)
      playBeat(i)
    }
  }
}

async function playBeat(beatI) {
  for (let i = 0; i < numDrums; i++) {
    const tile = drumArrays[i][beatI]
    if (tile != 0) {
      if (i == 0) {
        playHiHat()
      } else if (i == 1) {
        playSnare()
      } else {
        playKick()
      }
    }
  }
}

// _________Sounds Section ___________
//
//I will probobly either import sounds or create a thing that allows 
//you to easily make your own, but either way it likely wont stay as just a kick,
//snare, and hi hat sound.

const buffer = audioContext.createBuffer(
  1,
  audioContext.sampleRate * 1,
  audioContext.sampleRate,
)

const channelData = buffer.getChannelData(0)

for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1
}

const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05, 0)
primaryGainControl.connect(audioContext.destination)



// __White noise__
const button = document.createElement('button')
button.innerText = 'White Noise'
button.addEventListener('click', () => {
  const whiteNoiseSource = audioContext.createBufferSource()
  whiteNoiseSource.buffer = buffer
  whiteNoiseSource.connect(primaryGainControl)
  whiteNoiseSource.start()
})
document.querySelector('body').appendChild(button)



// __Snare__
const snareFilter = audioContext.createBiquadFilter()
snareFilter.type = 'highpass'
snareFilter.frequency.value = 2500
snareFilter.connect(primaryGainControl)

const snareButton = document.createElement('button')
snareButton.innerText = 'Snare'

snareButton.addEventListener('click', () => {
  playSnare()
})

function playSnare() {
  const whiteNoiseSource = audioContext.createBufferSource()
  whiteNoiseSource.buffer = buffer

  const whiteNoiseSourceGain = audioContext.createGain()
  whiteNoiseSourceGain.gain.setValueAtTime(1, audioContext.currentTime)
  whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1,
  )

  whiteNoiseSource.connect(whiteNoiseSourceGain)
  whiteNoiseSource.connect(snareFilter)

  whiteNoiseSource.start()
  whiteNoiseSource.stop(audioContext.currentTime + 0.1)

  const snareOscillator = audioContext.createOscillator()
  snareOscillator.type = 'square'
  snareOscillator.frequency.setValueAtTime(250, audioContext.currentTime)

  const oscillatorGain = audioContext.createGain()
  oscillatorGain.gain.setValueAtTime(1, audioContext.currentTime)
  oscillatorGain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1,
  )

  snareOscillator.connect(oscillatorGain)
  oscillatorGain.connect(primaryGainControl)
  snareOscillator.start()
  snareOscillator.stop(audioContext.currentTime + 0.01)
}
document.querySelector('body').appendChild(snareButton)



// ___Kick __

const kickButton = document.createElement('button')

kickButton.addEventListener('click', () => {
  playKick()
})

kickButton.innerText = 'Kick'
function playKick() {
  const kickOscillator = audioContext.createOscillator()

  kickOscillator.frequency.setValueAtTime(250, 0)
  kickOscillator.frequency.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.5,
  )

  const kickGain = audioContext.createGain()
  kickGain.gain.setValueAtTime(1, 0)
  kickGain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.5,
  )

  kickOscillator.connect(kickGain)
  kickGain.connect(primaryGainControl)
  kickOscillator.start()
  kickOscillator.stop(audioContext.currentTime + 0.5)
}
document.querySelector('body').appendChild(kickButton)




// ___Hi Hat ____


const hiHatFilter = audioContext.createBiquadFilter()
hiHatFilter.type = 'highpass'
hiHatFilter.frequency.value = 10000
hiHatFilter.connect(primaryGainControl)

const hiHatButton = document.createElement('button')
hiHatButton.innerText = 'Hi Hat'

hiHatButton.addEventListener('click', () => {
  playHiHat()
})

function playHiHat() {
  const whiteNoiseSource = audioContext.createBufferSource()
  whiteNoiseSource.buffer = buffer

  const whiteNoiseSourceGain = audioContext.createGain()
  whiteNoiseSourceGain.gain.setValueAtTime(1, audioContext.currentTime)
  whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1,
  )

  whiteNoiseSource.connect(whiteNoiseSourceGain)
  whiteNoiseSource.connect(hiHatFilter)

  whiteNoiseSource.start()
  whiteNoiseSource.stop(audioContext.currentTime + 0.2)

  const hiHatOscillator = audioContext.createOscillator()
  hiHatOscillator.type = 'square'
  hiHatOscillator.frequency.setValueAtTime(250, audioContext.currentTime)

  const oscillatorGain = audioContext.createGain()
  oscillatorGain.gain.setValueAtTime(.3, audioContext.currentTime)
  oscillatorGain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.05,
  )

  hiHatOscillator.connect(oscillatorGain)
  oscillatorGain.connect(primaryGainControl)
  hiHatOscillator.start()
  hiHatOscillator.stop(audioContext.currentTime + 0.01)
}
document.querySelector('body').appendChild(hiHatButton)