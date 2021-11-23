export { convertBufferToNotes } from './primitive'

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
export audioToMelody(audioData: Float32Array): [number, number] {
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

  return [quant, tempo];
}
