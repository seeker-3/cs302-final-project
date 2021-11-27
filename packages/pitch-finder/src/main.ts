import Pitchfinder from "pitchfinder";
import { Piano } from "@tonejs/piano";
const getAudioBuffer = async () => {
  const ctx = new AudioContext();
  const response = await fetch("C-major2.wav");
  if (! response.ok) {
    throw Error("Response not okay");
  }
  else {
    console.log("Response is ok");
  }
  const buffer = await response.arrayBuffer();
  const audio_buffer = ctx.decodeAudioData(buffer);
  return audio_buffer;
}

var convert = function (frequencies: (number | null)[]) {
  var musicalNotes
  for (let tone of frequencies) {
    if (tone === null) {
      continue;
    }
    musicalNotes.push(frequencyToNote(tone));
  }
  return musicalNotes
}

var frequencyToNote = function (input: any) {

var A4 = 440.0;
var A4_INDEX = 57;

var notes = [
  "C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0",
  "C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1",
  "C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2",
  "C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
  "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
  "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
  "C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6",
  "C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7",
  "C8","C#8","D8","D#8","E8","F8","F#8","G8","G#8","A8","A#8","B8",
  "C9","C#9","D9","D#9","E9","F9","F#9","G9","G#9","A9","A#9","B9" ];

var MINUS = 0;
var PLUS = 1;

var frequency;
var r = Math.pow(2.0, 1.0/12.0);
var cent = Math.pow(2.0, 1.0/1200.0);
var r_index = 0;
var cent_index = 0;
var side;  

frequency = A4;

if(input >= frequency) {
  while(input >= r*frequency) {
    frequency = r*frequency;
    r_index++;
  }
  while(input > cent*frequency) {
    frequency = cent*frequency;
    cent_index++;
  }
  if((cent*frequency - input) < (input - frequency))
    cent_index++;
  if(cent_index > 50) {
    r_index++;
    cent_index = 100 - cent_index;
    if(cent_index != 0)
      side = MINUS;
    else
      side = PLUS;
  }
  else
    side = PLUS;
}

else {
  while(input <= frequency/r) {
    frequency = frequency/r;
    r_index--;
  }
  while(input < frequency/cent) {
    frequency = frequency/cent;
    cent_index++;
  }
  if((input - frequency/cent) < (frequency - input))
    cent_index++;
  if(cent_index >= 50) {
    r_index--;
    cent_index = 100 - cent_index;
    side = PLUS;
  }
  else {
    if(cent_index != 0)
      side = MINUS;
    else
      side = PLUS;
  }  
}

var result = notes[A4_INDEX + r_index];
/* if(side == PLUS)
  result = result + " plus ";
else
  result = result + " minus ";
result = result + cent_index + " cents"; */
return result;
}

const FindPitch = async () => {
  const detectPitch = Pitchfinder.YIN();
  const myAudioBuffer = await getAudioBuffer(); // assume this returns a WebAudio AudioBuffer object
  const float32Array = myAudioBuffer.getChannelData(0); // get a single channel of sound
  const melody = audioToMelody(float32Array, myAudioBuffer.sampleRate);
  console.log(melody);
  const detectors = [detectPitch, Pitchfinder.AMDF()];
  const moreAccurateFrequencies = Pitchfinder.frequencies(detectors, float32Array, melody);
  return moreAccurateFrequencies;
}
 
function getCommonInterval(intervals: number[]) {
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

  if (!commonInterval) {
    throw Error('common interval not found')
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
const averageFloat32Array = (array: Float32Array) =>
  array.reduce((a, b) => Math.abs(a) + Math.abs(b), 0) / array.length

//This function takes the a vector of audio data and calculates the
//quantization value and the tempo. At the moment this is all it does, but
//it can be made to produce a vector that describes when a note should be played
//and for how long.
const audioToMelody = (audioData: Float32Array, sampleRate: number) => {
  //minStep is the period of time in-between the peaks of
  //the minFreq. It is represented in the number of elements
  //in the audio data that span that time
  const minStep = sampleRate / minFreq

  //quantLen will store the shortest interval in the audio data.
  //In other words it is the duration of one beat according to whatever
  //the quantization value is
  let quantizationLength = audioData.length

  const notes = [] //stores the index at which notes start
  let note = false //tells the for loop if a note is currently playing

  //This for loop iterates through the audioData minStep elements at a time
  //It records the index of the start of each note
  for (let i = 0; i < quantizationLength; i += minStep) {
    // step holds the values within the range of minStep
    const step = audioData.slice(i, i + minStep) //get the next minStep worth of elements

    //If a note was not already playing and the amplitude is higher than minAmp
    //Then record the start of a note and tell the note variable that a note is now playing
    if (!note && averageFloat32Array(step) > minAmp) {
      notes.push(i)
      note = true
    }
    //else if a note is currently playing and the amplitude drops bellow minAmp
    //Then tell the note variable that the note is no longer playing
    else if (note && averageFloat32Array(step) < minAmp) {
      note = false
    }
  }

  const intervals = [] //This stores the intervals between the start of each note

  //This for loop iterates of the notes vector to find the shortest interval between
  //the start of two notes. The shortest interval, or quantLen, has to be found before recording all of
  //the intervals between notes because the intervals are recorded as multiples of the shortest interval
  for (let i = 0; i < notes.length - 1; i++) {
    // holds the current interval length
    const interval = notes[i + 1] - notes[i]
    if (interval < quantizationLength) {
      quantizationLength = interval
    }
  }

  //This for loop iterates over the notes vector calculating and recording the interval
  //length between the start of each note
  for (let i = 0; i < notes.length - 1; i++) {
    //calculate and record the current interval as an integer multiple of the
    //shortest interval. Recoding the intervals this way makes finding the most
    //common interval significantly easier and more standardized
    const interval = notes[i + 1] - notes[i]
    intervals.push(parseInt((interval / quantizationLength).toFixed()))
  }

  //convert the quantLen from number of elements to time in seconds
  quantizationLength /= sampleRate

  //quant is the quantization value. The getCommonInterval function returns the number of shortest
  //interval lengths that make up the most common interval. In other words it is the beats for
  //each whole note. It may be a good idea to pass 2 * quant as the quantization value, that way
  //a note that is hummed twice quickly can be registered as two distinct sounds rather than one
  //continuous one.
  const quantization = getCommonInterval(intervals)*2;

  //tempo is expressed in beats per minute. quantLen * quant is the amount of
  //time for a whole note in seconds (seconds/beat). Dividing 60 seconds by this value
  //gets beats/minute
  const tempo = Number((60 / (quantizationLength * quantization)).toFixed(0));

  return { quantization, tempo }
}

function autoCorrelate(buf: Float32Array, sampleRate: number ) {
  var SIZE = buf.length;
  var MIN_SAMPLES = 0;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}

const button = document.getElementById("playBtn");
if (button) {
  button.onclick = async function() {
    const frequencies = await FindPitch();
    const musicalNotes = convert(frequencies);
    console.log(musicalNotes)
    const piano = new Piano({
      velocities: 5
    })
    piano.toDestination()
    piano.load().then(() => {
      console.log('loaded!')
      let i = 0.0
      for (let note of musicalNotes) {
        piano.keyDown({ note, time: `+${i}` })
        piano.keyUp({note, time: `+${i+0.5}`})
        // increment size determines note length -- currently 
        // 0,5s note length
        i += 0.5
      }
    })
  }
}