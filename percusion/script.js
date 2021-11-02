import './style.css'

const audioContext = new AudioContext();

const recorder = document.getElementById('recorder');
const wisper = 0.02;

let numBeats = 16;
let numDrums = 2;


recorder.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    const response = await fetch(url);
    const soundBuffer = await response.arrayBuffer();
    const bpmBuffer = await audioContext.decodeAudioData(soundBuffer);

    let audioData = bpmBuffer.getChannelData(0);
    let length = audioData.length;
    let rythmnData = [];
    let labels = [];
    let beats = [];

    let i;


    for (i = 0; i < length; i++) {
        if (audioData[i] > wisper) {
            rythmnData.push(1);
            let current = i;
            beats.push(i);
            for (i = current; i < current + 5000; i++) {
                rythmnData.push(0);
                labels.push(i);
            }
        }
        else {
            rythmnData.push(0);
            labels.push(i)
        }
    }

    let intervals = [];
    let sum = 0;
    for (i = 0; i < beats.length-1; i++) {
        intervals.push(beats[i+1] - beats[i]);
        sum += beats[i+1] - beats[i];
    }

    let tempo = (60 / (sort(intervals) / 41000)).toFixed();

    document.querySelector('#rec').innerHTML = `
    <h2>Your Temp is ` + tempo + ` BPM</h2>`
    
});


function sort(intervals) {
    
    let intervalCats = [];
    let intervalRanks = [];

    intervalCats.push(intervals.pop());
    intervalRanks.push(1);

    while (intervals.length > 0) {
        
        let i = 0;
        for (i = 0; i < intervalCats.length; i++) {

            let diff = Math.abs(intervalCats[i] - intervals[intervals.length-1]);

            if (diff < intervalCats[i]/2) {

                intervalCats[i] *= intervalRanks[i];
                intervalRanks[i]++;

                intervalCats[i] += intervals.pop();
                intervalCats[i] /= intervalRanks[i];
                
                break;
            }
        }

        if (i == intervalCats.length) {
            intervalCats.push(intervals.pop());
            intervalRanks.push(1);
        }
    }

    let maxRank = 0;
    let commonInterval;
    for (let i = 0; i < intervalRanks.length; i++) {
        if (intervalRanks[i] > maxRank) {
            maxRank = intervalRanks[i];
            commonInterval = intervalCats[i];
        }
    }

    return commonInterval;
}


function makeChart(rythmnData, labels) {

    const data = {
        labels: labels,
        datasets: [{
          label: 'Sound Data',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: "rgb(255, 99, 132)",
          data: rythmnData,
        }]
      };
    
      const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
              x: {
                type: 'linear',
                position: 'bottom'
              }
            }
        }
      };
      
      const myChart = new Chart(
        document.getElementById('myChart'),
        config
      );
}

const machineContainer = document.getElementById("drums");

makeDrumMachine(numDrums, numBeats);

function makeDrumMachine(numDrums, numBeats) {

    for (let i = 0; i < numDrums; i++) {
        new newDrumMachine(numBeats, i);
    }
}

function newDrumMachine(numBeats, index) {

    this.newDrumMachine = document.createElement('dev');
    this.newDrumMachine.setAttribute('id', 'drum' + index);
    machineContainer.appendChild(this.newDrumMachine);
    let linebreak = document.createElement('br');

    for (let i = 0; i < numBeats; i++) {
        new newDrum(this.newDrumMachine, i, index);
    }
    
    machineContainer.appendChild(linebreak);
}

function newDrum(drum, index, drumType) {

    this.newDrum = document.createElement('button');
    this.newDrum.setAttribute('id', 'beat' + drumType + index);
    this.newDrum.setAttribute('class', 'beat');

    drum.appendChild(this.newDrum);

    this.newDrum.onclick = () => {
        if (!this.newDrum.clicked) {
            this.newDrum.classList.add('beat-selected');
            this.newDrum.clicked = true;
        } 
        else {
            this.newDrum.classList.remove('beat-selected');
            this.newDrum.clicked = false;
        }
    }

    
}

//________Loop Section ______________

const sleepFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

let play = document.getElementById('play');
play.onclick = () => {playTrack();}



async function playTrack() {
    for (let i = 0; i < numBeats; i++) {
        playBeat(i);
        console.log("here");
    }
}


function playBeat(beatI) {
    
    for (let i = 0; i < numDrums; i++) {
        let tile = document.getElementById('beat' + i + beatI);
        setTimeout(function () {
            if (tile.clicked) {
                if (i == 0) {
                    playKick();
                } else {
                    playSnare();
                }
            }
        }, 125 * (beatI % numBeats));
    }
}





//_________Sounds Section ___________

const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate
  );
  
  const channelData = buffer.getChannelData(0);
  
  for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }




const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);
primaryGainControl.connect(audioContext.destination);



const button = document.createElement('button');
button.innerText = "White Noise";
button.addEventListener("click", () => {
  const whiteNoiseSource = audioContext.createBufferSource();
  whiteNoiseSource.buffer = buffer;
  whiteNoiseSource.connect(primaryGainControl);
  whiteNoiseSource.start();
})
document.querySelector('body').appendChild(button);





const snareFilter = audioContext.createBiquadFilter();
snareFilter.type = "highpass";
snareFilter.frequency.value = 2500;
snareFilter.connect(primaryGainControl);


const snareButton = document.createElement('button');
snareButton.innerText = "Snare";

snareButton.addEventListener('click', () =>{
    playSnare();
})


function playSnare() {
  const whiteNoiseSource = audioContext.createBufferSource();
  whiteNoiseSource.buffer = buffer;

  const whiteNoiseSourceGain = audioContext.createGain();
  whiteNoiseSourceGain.gain.setValueAtTime(1, audioContext.currentTime);
  whiteNoiseSourceGain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

  whiteNoiseSource.connect(whiteNoiseSourceGain);
  whiteNoiseSource.connect(snareFilter);

  whiteNoiseSource.start();
  whiteNoiseSource.stop(audioContext.currentTime + 0.1);

  const snareOscillator = audioContext.createOscillator();
  snareOscillator.type = "square";
  snareOscillator.frequency.setValueAtTime(250, audioContext.currentTime);

  const oscillatorGain = audioContext.createGain();
  oscillatorGain.gain.setValueAtTime(1, audioContext.currentTime);
  oscillatorGain.gain.exponentialRampToValueAtTime(
      0.01, 
      audioContext.currentTime + 0.1
    );

  snareOscillator.connect(oscillatorGain);
  oscillatorGain.connect(primaryGainControl);
  snareOscillator.start();
  snareOscillator.stop(audioContext.currentTime + 0.01);


}
document.querySelector('body').appendChild(snareButton);



const kickButton = document.createElement("button");

kickButton.addEventListener("click", () => {
    playKick();
})

kickButton.innerText = "Kick";
function playKick() {
  const kickOscillator = audioContext.createOscillator();

  kickOscillator.frequency.setValueAtTime(250, 0);
  kickOscillator.frequency.exponentialRampToValueAtTime(
    0.001, 
    audioContext.currentTime + 0.5
  );

  const kickGain = audioContext.createGain();
  kickGain.gain.setValueAtTime(1,0);
  kickGain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.5
  );

  kickOscillator.connect(kickGain);
  kickGain.connect(primaryGainControl);
  kickOscillator.start()
  kickOscillator.stop(audioContext.currentTime + 0.5);
}
document.querySelector("body").appendChild(kickButton);
