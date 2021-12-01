import {
  addBeat,
  addDrum,
  inputAudioFile,
  pauseTrack,
  playTrack,
  removeBeat,
  removeDrum,
  shiftLeft,
  shiftRight,
} from './src/lib'

import { drumArrays, playHiHat, playKick, playSnare } from './src/helper'

const recorder = document.getElementById('recorder') as HTMLInputElement

recorder.onchange = async ({ target }) => {
  const file = (target as HTMLInputElement).files[0]
  let label = ''
  if (drumArrays.length == 0) {
    label = 'hihat'
  } else if (drumArrays.length == 1) {
    label = 'snare'
  } else {
    label = 'kick'
  }
  await inputAudioFile(file, label)
}

const addToMachineButton = document.getElementById('addToMachine')
addToMachineButton.onclick = () => {
  makeDrumMachine()
}

const addBeatButton = document.getElementById('addBeat')
addBeatButton.onclick = () => {
  addBeat()
  makeDrumMachine()
}

const remBeatButton = document.getElementById('remBeat')
remBeatButton.onclick = () => {
  removeBeat()
  makeDrumMachine()
}

const addDrumButton = document.getElementById('addDrum')
addDrumButton.onclick = () => {
  let label = ''
  if (drumArrays.length == 0) {
    label = 'hihat'
  } else if (drumArrays.length == 1) {
    label = 'snare'
  } else {
    label = 'kick'
  }
  addDrum(label)
  makeDrumMachine()
}

// _________UI stuff__________________
//
// All the stuff in this section is just making buttons and stuff like that so I can
// test out my code.

// All of this dom manipulation is just to give me a way to visualize the drum machine and add beats
// from the website.
// The functions for manipulating the drum machine are above. The functions for playing the drum machine
// do not require these function bellow.

const machineContainer = document.getElementById('drums')

function makeDrumMachine() {
  // I'm deleting whatever was in the machine container before because
  // I create a new drum machine every time I edit the the parameters of it.
  while (machineContainer.firstChild) {
    machineContainer.removeChild(machineContainer.firstChild)
  }
  for (let i = 0; i < drumArrays.length; i++) {
    new newDrumMachine(i)
  }
}

function newDrumMachine(index) {
  const lineBreak = document.createElement('br')

  // This will button calls the shiftLeft function. Its
  // faint because I don't know how to do UI
  const leftButton = document.createElement('button')
  leftButton.innerText = '<'
  leftButton.onclick = () => {
    shiftLeft(index)
    makeDrumMachine()
  }

  // This button will call the shiftRight function
  const rightButton = document.createElement('button')
  rightButton.innerText = '>'
  rightButton.onclick = () => {
    shiftRight(index)
    makeDrumMachine()
  }

  // This is to make a button that can remove specific drums from
  // The machine. The button is at the end of each drum line
  const deleteButton = document.createElement('button')
  deleteButton.innerText = 'DEL'
  deleteButton.onclick = () => {
    removeDrum(index)
    makeDrumMachine()
  }

  machineContainer.appendChild(leftButton)

  this.newDrumMachine = document.createElement('div')
  this.newDrumMachine.setAttribute('id', 'drum' + index)
  machineContainer.appendChild(this.newDrumMachine)

  for (let i = 0; i < drumArrays[0]?.beats.length ?? 0; i++) {
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

  // This if statement loads whatever is in the drumArrays onto the
  // drum machine visualizer.
  if (drumArrays[drumIndex].beats[beatIndex] == 1) {
    this.newDrum.classList.add('beat-selected')
    this.newDrum.clicked = true
  }

  drum.appendChild(this.newDrum)

  this.newDrum.onclick = () => {
    if (!this.newDrum.clicked) {
      this.newDrum.classList.add('beat-selected')
      this.newDrum.clicked = true
      drumArrays[drumIndex].beats[beatIndex] = 1 // This makes it so the buttons on the website can edit the drum machine pattern
    } else {
      this.newDrum.classList.remove('beat-selected')
      this.newDrum.clicked = false
      drumArrays[drumIndex].beats[beatIndex] = 0 // Same here
    }
  }
}

// ________Loop Section ______________

const play = document.getElementById('play')
const pause = document.getElementById('pause')
play.onclick = () => playTrack(true)
pause.onclick = pauseTrack

// __Snare__

const snareButton = document.createElement('button')
snareButton.innerText = 'Snare'

snareButton.onclick = () => {
  playSnare()
}

document.body.appendChild(snareButton)

// ___Kick __

const kickButton = document.createElement('button')
kickButton.innerText = 'Kick'
kickButton.onclick = () => {
  playKick()
}

document.body.appendChild(kickButton)

// ___Hi Hat ____

const hiHatButton = document.createElement('button')
hiHatButton.innerText = 'Hi Hat'
hiHatButton.onclick = () => {
  playHiHat()
}

document.body.appendChild(hiHatButton)
