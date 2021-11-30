import {
  addBeat,
  addDrum,
  drumArrays,
  inputAudioFile,
  pauseTrack,
  playTrack,
  removeBeat,
  removeDrum,
} from '@dothum/percussion'
import classNames from 'classnames'
import { type FC, useReducer } from 'react'

const usePercussion = (file: File | null) => {
  const [drums, updateLocalDrumState] = useReducer(
    () => [...drumArrays],
    drumArrays
  )
  const [playing, togglePlayState] = useReducer(state => !state, false)

  const loadDrum = async () => {
    if (!file) return
    await inputAudioFile(file)
    updateLocalDrumState()
  }

  const handlePlayState = () => {
    if (playing) pauseTrack()
    else playTrack()
    togglePlayState()
  }

  const handleAddDrum = () => {
    addDrum()
    updateLocalDrumState()
  }

  const handleRemoveDrum = (index: number) => {
    removeDrum(index)
    updateLocalDrumState()
  }

  const handleAddBeat = () => {
    addBeat()
    updateLocalDrumState()
  }

  const handleRemoveBeat = () => {
    removeBeat()
    updateLocalDrumState()
  }

  const toggleBeat = (index1: number, index2: number) => {
    drumArrays[index1][index2] = drumArrays[index1][index2] ? 0 : 1
    updateLocalDrumState()
  }

  return {
    drums,
    playing,
    loadDrum,
    handlePlayState,
    handleAddDrum,
    handleRemoveDrum,
    handleAddBeat,
    handleRemoveBeat,
    toggleBeat,
  }
}

export default (function ({ audioFile }) {
  const {
    drums,
    playing,
    loadDrum,
    handlePlayState,
    handleAddDrum,
    handleRemoveDrum,
    handleAddBeat,
    handleRemoveBeat,
    toggleBeat,
  } = usePercussion(audioFile)

  const loaderDisabled = !audioFile
  const controlsDisabled = loaderDisabled || !drums.length

  return (
    <div className="column">
      <div className="row">
        <button className="width2" disabled={!audioFile} onClick={loadDrum}>
          load beat
        </button>
        <button
          className="width2"
          onClick={handlePlayState}
          disabled={controlsDisabled}
        >
          {playing ? 'pause' : 'play'}
        </button>
        <button
          className="width2"
          onClick={handleAddBeat}
          disabled={controlsDisabled}
        >
          add beat
        </button>
        <button
          className="width2"
          onClick={handleRemoveBeat}
          disabled={controlsDisabled}
        >
          remove beat
        </button>
        <button
          className="width2"
          onClick={handleAddDrum}
          disabled={controlsDisabled}
        >
          add drum
        </button>
      </div>
      <div className="column">
        {drums.map((beats, i) => (
          <div className="row align-items-start" key={i}>
            <button onClick={() => handleRemoveDrum(i)}>remove</button>
            <div className="drum-beats">
              {beats.map((beat, j) => (
                <button
                  className={classNames({ selected: beat })}
                  key={j}
                  onClick={() => toggleBeat(i, j)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} as FC<{ audioFile: File | null }>)
