
const audioContext = new AudioContext

//This is used to hold the settings for one of the audio nodes
//used to generate drum sounds
interface AudioNodeConfig {
    frequency: number
    gain: number
    time: number
    ramp: number
    volume: number
}

//This holds the two audio node configurations needed to make
//a drum sound
export interface SoundSettings {
    noise: AudioNodeConfig
    oscillation: AudioNodeConfig
}


const whisper = 0.02

export let minInterval = 250 // smallest interval between beats in milliseconds

export const drumArrays: {label: string, beats: (0|1)[] }[] = []// holds drum patters and instrument labels


//used to leave time inbetween beats
export const sleepFor = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))


//This function takes in an array of intervals between beats and returns the most common one.
//The intervals are measured in how many multiples of minInterval they are.
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
  
//This function takes in a vector of raw audio data and turns it into a drum pattern.
//This drum pattern is then added to the drum machine
export function audioToDrum(audioData: Float32Array, instrumentLabel: string) {
    const length = audioData.length
    const beats = []
  
    // This for loop iterate through the raw audio data looking
    // for the start of beat by searching for volume value greater
    // than the predetermined value for background noise.
    let i
    for (i = 0; i < length; i++) {
      if (audioData[i] > whisper) {
        beats.push(i)
        //this jumps 1/16 of a second forward to jump over the rest of the beat
        i += parseInt((audioContext.sampleRate / 8).toFixed())
      } 
    }
  
    const intervals = []
    for (i = 0; i < beats.length - 1; i++) {
      intervals.push(beats[i + 1] - beats[i])
    }
  
    // minInterval is used to set the amount of time between playing each
    // tile on the drum machine. The interval variable here holds the smallest 
    //interval in the new audioData so it can be compared to the current minInterval
    const interval =
      Math.min.apply(null, intervals) / (audioContext.sampleRate / 1000)

    //If the smallest interval in the new drum data is smaller than the current
    //minInterval then the number of tiles inbetweeen each beat needs to change for
    //the rest of the drums, so resetDrums is called. 
    if (interval < minInterval && drumArrays.length > 0) {
      resetDrums(interval)
      minInterval = interval
    } else if (drumArrays.length == 0) {
      minInterval = interval
    }
  
    //This for loop constructs the drum pattern for the new drum.
    //Each element in the beats array holds the index value of a 
    //beat in the audioData, so for each beat it adds a 1 to the new
    //drum pattern and then it adds the appropiot number of 0s after it
    //to match the number of minIntervals before the next beat.
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
    
    //This if statement stops the program from running this next bit 
    //if there are no drums in the drumArray yet
    if (drumArrays.length > 0) {

      //This if else statement determines if the newDrum pattern is longer than the current
      //drum patterns. If it is then the current drum patterns have to be extended with 0s.
      //Else if the newDrum pattern is shorter then it has to be extended with 0s
      const currLength = drumArrays[0].beats.length
      const newLength = newDrum.length
      if (newLength > currLength) {
        for (let i = 0; i < newLength -currLength; i++) {
          for (let j = 0; j < drumArrays.length; j++) {
            drumArrays[j].beats.push(0)
          }
        }
      } else if (newLength < currLength) {
        const diff = currLength - newLength
        for (let i = 0; i < diff; i++) {
          newDrum.push(0)
        }
      }
    }
    
    drumArrays.push({label: instrumentLabel, beats: newDrum})
  
}

//This function streatches the current drum patterns to match a faster rythmn of a newDrum.
//It does this by getting the quotient of dividing the old minInterval by the new one. This value
//is then used to muliply the number of tiles after each current tile.
export function resetDrums(interval: number) {
    //get the factor by which the patterns are stretched 
    const beatMultiplier = parseInt((minInterval / interval).toFixed())
  
    //These for loops iterate through each of the drum patterns starting at the end.
    //It starts at the end of each drum pattern so the newly added beat wont effect 
    //our ability to iterate through the current drum pattern. At each tile it adds
    //beatMultiplier-1 number of tiles infront of the current one.
    for (let i = 0; i < drumArrays.length; i++) {
      for (let j = drumArrays[0].beats.length; j > 0; j--) {
        for (let add = 0; add < beatMultiplier - 1; add++) {
          drumArrays[i].beats.splice(j, 0, 0)
        }
      }
    }
}





//Functions for playing sounds//////////////////
///////////////////////////////////////////////



//This function plays one column of drumArrays by iterating through
//each row at a given beatIndex. 
export async function playBeat(beatIndex: number) {

    //This for loop iterates through each drum pattern at
    //a given beatIndex
    for (let i = 0; i < drumArrays.length; i++) {
      const tile = drumArrays[i].beats[beatIndex]

      //This if statement determines if the tile says play
      //or not and then plays the appropiot sound
      if (tile != 0) {

        //This if else statement determines which sound to play 
        //given the collumn index of drumArray. The first drum is 
        //allways a hihat, the second a snare, and the third a kick
        if (drumArrays[i].label == "hihat") {
          playHiHat()
        }
        else if (drumArrays[i].label == "snare") {
          playSnare()
        }
        else if (drumArrays[i].label == "kick") {
          playKick()
        }
      }
    }
}
  

//Create a buffer that we will use to create a sound.
const buffer = audioContext.createBuffer(
    1, //number of channels 
    audioContext.sampleRate * 1,//length
    audioContext.sampleRate,//sample rate
)
  
//get the channelData in the form of a vector of amplitudes, 
//all of which are 0 right now
const channelData = buffer.getChannelData(0)
  
//This for loop goes through the channelData vector 
//randomly asigning amplitude values to each point.
//This will create white noise. This white noise vector
//will be used to make the ratteling sound you get in some 
//drums like HiHats and Snares
for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1
}
  
// Making primary gain control and connecting it to
// destination (The default audio out)
export const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05, 0)
primaryGainControl.connect(audioContext.destination)

export const audioDestination = audioContext.createMediaStreamDestination()

export const audioOut = audioContext.destination
  


// __Snare__
  
//Setting the values of the snareSoundObject to make sound profile
//for the white noise apsect and the oscillator aspect. I do the same thing for the other 
//two sounds (kick and HiHat) but with different settings. 
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

//The playSnare function calls the playSound function with the appropriot 
//settings. The other sounds will do the same for their functions
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


//This function takes in a SoundSetting object and uses its
//values to play the desired sound
export async function playSound(sound: SoundSettings) {


    //Here we are making a highpass filter that filters out
    //frequencies below a certain threshold. This filter is used to make
    //the resulting sound from white noise and oscillator less chaotic 
    const filter = audioContext.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = sound.noise.frequency
    filter.connect(primaryGainControl)
  
    //Here we make a buffer for the while noise source and set it 
    //equal to the white noise buffer we made earlier. whiteNoiseSource will
    //be used to change the noise for each sound we play
    const whiteNoiseSource = audioContext.createBufferSource()
    whiteNoiseSource.buffer = buffer
  
    //Here we make a gain controller for the whiteNoise. This controller decreases the gain 
    //of the noise exponentialy over a given period of time
    const whiteNoiseSourceGain = audioContext.createGain()
    whiteNoiseSourceGain.gain.setValueAtTime(sound.noise.volume, audioContext.currentTime)
    whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
      sound.noise.ramp, //ramp down to this volume
      audioContext.currentTime + sound.noise.gain, //ramp to the volume in this amount of time
    )
  
    //connect the whiteNoiseSource to its gain controller and the highpass filter
    whiteNoiseSource.connect(whiteNoiseSourceGain)
    whiteNoiseSource.connect(filter)
  
    //Here we tell the white noise to start playing and end at a specified time. 
    //The program will continue to run while it plays
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


