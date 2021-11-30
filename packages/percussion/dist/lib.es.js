const audioContext = new AudioContext();
const whisper = 0.02;
let numBeats = 0;
let numDrums = 0;
let minInterval = 125;
const drumArrays = [];
const soundSettings = [];
const defaultSounds = [
  [1e4, 0.1, 0.1, 0.01, 1, 250, 0.1, 5e-3, 0.01, 0.3],
  [2500, 0.1, 0.1, 0.1, 1, 250, 0.1, 0.1, 0.01, 1],
  [0, 0, 0, 0.01, 0, 250, 0.2, 0.2, 1e-4, 1]
];
const sleepFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const inputAudioFile = async (file) => {
  const soundBuffer = await file.arrayBuffer();
  const dataBuffer = await audioContext.decodeAudioData(soundBuffer);
  const audioData = dataBuffer.getChannelData(0);
  audioToDrum(audioData);
};
function getDrumBPM() {
  let count = 0;
  for (let i = 0; i < numDrums; i++) {
    for (let j = 1; j < numBeats; j++) {
      if (drumArrays[i][j] == 1 && count == 1)
        ;
      else if (drumArrays[i][j] == 1 && count == 0) {
        count = 1;
      }
    }
    count = 0;
  }
}
function addDrum() {
  const drumPattern = new Array(numBeats).fill(0);
  soundSettings.push(defaultSounds[drumArrays.length]);
  drumArrays.push(drumPattern);
  numDrums++;
}
function removeDrum(drumIndex) {
  drumArrays.splice(drumIndex, 1);
  soundSettings.splice(drumIndex, 1);
  numDrums--;
}
function addBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].push(0);
  }
  numBeats++;
}
function removeBeat() {
  for (let i = 0; i < drumArrays.length; i++) {
    drumArrays[i].pop();
  }
  numBeats--;
}
function shiftRight(drumIndex) {
  drumArrays[drumIndex].unshift(0);
  drumArrays[drumIndex].pop();
}
function shiftLeft(drumIndex) {
  drumArrays[drumIndex].shift();
  drumArrays[drumIndex].push(0);
}
let run = false;
async function playTrack() {
  run = true;
  while (run) {
    for (let i = 0; i < numBeats; i++) {
      if (!run) {
        break;
      }
      await sleepFor(minInterval);
      playBeat(i);
    }
  }
}
function pauseTrack() {
  run = false;
}
function playSound(setting) {
  const noiseFreq = setting[0];
  const noiseGain = setting[1];
  const noiseTime = setting[2];
  const noiseRamp = setting[3];
  const noiseVol = setting[4];
  const oscillationFreq = setting[5];
  const oscillationGain = setting[6];
  const oscillationTime = setting[7];
  const oscillationRamp = setting[8];
  const oscillationVol = setting[9];
  const filter = audioContext.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = noiseFreq;
  filter.connect(primaryGainControl);
  const whiteNoiseSource = audioContext.createBufferSource();
  whiteNoiseSource.buffer = buffer;
  const whiteNoiseSourceGain = audioContext.createGain();
  whiteNoiseSourceGain.gain.setValueAtTime(noiseVol, audioContext.currentTime);
  whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(noiseRamp, audioContext.currentTime + noiseGain);
  whiteNoiseSource.connect(whiteNoiseSourceGain);
  whiteNoiseSource.connect(filter);
  whiteNoiseSource.start();
  whiteNoiseSource.stop(audioContext.currentTime + noiseTime);
  const oscillator = audioContext.createOscillator();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(oscillationFreq, audioContext.currentTime);
  const oscillatorGain = audioContext.createGain();
  oscillatorGain.gain.setValueAtTime(oscillationVol, audioContext.currentTime);
  oscillatorGain.gain.exponentialRampToValueAtTime(oscillationRamp, audioContext.currentTime + oscillationGain);
  oscillator.connect(oscillatorGain);
  oscillatorGain.connect(primaryGainControl);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + oscillationTime);
}
function audioToDrum(audioData) {
  const length = audioData.length;
  const beats = [];
  for (let i = 0; i < length; i++) {
    if (audioData[i] > whisper) {
      const current = i;
      beats.push(i);
      for (i = current; i < current + 5e3; i++) {
      }
    }
  }
  const intervals = [];
  for (let i = 0; i < beats.length - 1; i++) {
    intervals.push(beats[i + 1] - beats[i]);
  }
  const interval = Math.min.apply(null, intervals) / (audioContext.sampleRate / 1e3);
  if (interval < minInterval && numDrums > 0) {
    resetDrums(interval);
    minInterval = interval;
  } else if (numDrums == 0) {
    minInterval = interval;
  }
  const newDrum = [];
  for (let b = 0; b < beats.length - 1; b++) {
    newDrum.push(1);
    const space = parseInt((intervals[b] / (minInterval * (audioContext.sampleRate / 1e3))).toFixed());
    for (let i = 0; i < space - 1; i++) {
      newDrum.push(0);
    }
  }
  if (newDrum.length > numBeats) {
    for (let i = 0; i < newDrum.length - numBeats; i++) {
      for (let j = 0; j < numDrums; j++) {
        drumArrays[j].push(0);
      }
    }
    numBeats = newDrum.length;
  } else if (newDrum.length < numBeats) {
    const diff = numBeats - newDrum.length;
    for (let i = 0; i < diff; i++) {
      newDrum.push(0);
    }
  }
  soundSettings.push(defaultSounds[drumArrays.length]);
  drumArrays.push(newDrum);
  numDrums = drumArrays.length;
  getDrumBPM();
}
function resetDrums(interval) {
  const beatMultiplier = parseInt((minInterval / interval).toFixed());
  for (let i = 0; i < numDrums; i++) {
    for (let j = numBeats; j > 0; j--) {
      for (let add = 0; add < beatMultiplier - 1; add++) {
        drumArrays[i].splice(j, 0, 0);
      }
    }
  }
  numBeats = drumArrays[0].length;
}
async function playBeat(beatIndex) {
  for (let i = 0; i < numDrums; i++) {
    const tile = drumArrays[i][beatIndex];
    if (tile != 0) {
      playSound(soundSettings[i]);
    }
  }
}
const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 1, audioContext.sampleRate);
const channelData = buffer.getChannelData(0);
for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1;
}
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);
primaryGainControl.connect(audioContext.destination);
const snareSoundArray = [2500, 0.1, 0.1, 0.1, 1, 250, 0.1, 0.1, 0.01, 1];
function playSnare() {
  playSound(snareSoundArray);
}
function playKick() {
  playSound([0, 0, 0, 0.01, 0, 250, 0.2, 0.2, 1e-4, 1]);
}
function playHiHat() {
  playSound([1e4, 0.1, 0.1, 0.01, 1, 250, 0.1, 5e-3, 0.01, 0.3]);
}
export { addBeat, addDrum, drumArrays, getDrumBPM, inputAudioFile, pauseTrack, playHiHat, playKick, playSnare, playSound, playTrack, removeBeat, removeDrum, shiftLeft, shiftRight };
