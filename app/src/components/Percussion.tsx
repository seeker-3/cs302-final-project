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
import { FC, useReducer, useState } from 'react'

export const usePercussion = (file: File | null) => {
  const [drums, updateLocalDrumState] = useReducer(
    () => [...drumArrays],
    drumArrays
  )
  const [playing, setPlaying] = useState(false)

  const loadDrum = async () => {
    if (!file) return
    await inputAudioFile(file)
    updateLocalDrumState()
  }

  const handlePlayState = () => {
    if (playing) pauseTrack()
    else playTrack()
    setPlaying(!playing)
  }

  const handleAddDrum = () => {
    addDrum()
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

  return {
    drums,
    playing,
    loadDrum,
    updateLocalDrumState,
    handlePlayState,
    handleAddDrum,
    handleAddBeat,
    handleRemoveBeat,
  }
}

export default (function ({ audioFile }) {
  const {
    drums,
    playing,
    loadDrum,
    updateLocalDrumState,
    handlePlayState,
    handleAddDrum,
    handleAddBeat,
    handleRemoveBeat,
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
            <button
              onClick={() => {
                removeDrum(i)
                updateLocalDrumState()
              }}
            >
              remove
            </button>
            <div className="drum-beats">
              {beats.map((beat, j) => (
                <button
                  className={classNames({ selected: beat })}
                  key={j}
                  onClick={() => {
                    drumArrays[i][j] = drumArrays[i][j] ? 0 : 1
                    updateLocalDrumState()
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} as FC<{ audioFile: File | null }>)
