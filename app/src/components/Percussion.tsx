import {
  addBeat,
  addDrum,
  drumArrays,
  inputAudioFile,
  pauseTrack,
  PercussionInstruments,
  playTrack,
  removeBeat,
  removeDrum,
} from '@dothum/percussion'
import classNames from 'classnames'
import { useReducer, type FC } from 'react'

export const usePercussion = (
  audioFile: File | null,
  percussionIndex: PercussionInstruments
) => {
  const [drums, updateLocalDrumState] = useReducer(
    () => [...drumArrays],
    drumArrays
  )
  const [playing, togglePlayState] = useReducer(state => !state, false)

  const loadDrum = async () => {
    if (!audioFile) return
    await inputAudioFile(audioFile, percussionIndex)
    updateLocalDrumState()
  }

  const handlePlayState = () => {
    if (playing) pauseTrack()
    else playTrack()
    togglePlayState()
  }

  const handleAddDrum = () => {
    addDrum(percussionIndex)
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

export default (function percussion({
  drums,
  playing,
  handlePlayState,
  handleAddDrum,
  handleRemoveDrum,
  handleAddBeat,
  handleRemoveBeat,
  toggleBeat,
}) {
  const isDrums = !!drums.length
  const isBeats = isDrums && !!drums[0].length

  return (
    <div className="column">
      <div className="row">
        {/* <button className="width2" disabled={disabled} onClick={loadDrum}>
          load beat
        </button> */}
        <button
          className="width2"
          disabled={!isDrums}
          onClick={handlePlayState}
        >
          {playing ? 'pause' : 'play'}
        </button>
        <button className="width2" disabled={!isDrums} onClick={handleAddBeat}>
          add beat
        </button>
        <button
          className="width2"
          disabled={!isBeats}
          onClick={handleRemoveBeat}
        >
          remove beat
        </button>
        <button className="width2" onClick={handleAddDrum}>
          add drum
        </button>
      </div>
      <div className="column">
        {drums.map((beats, i) => (
          <div className="row align-items-start" key={i}>
            <button
              disabled={drums.length === 1 && playing}
              onClick={() => handleRemoveDrum(i)}
            >
              remove
            </button>
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
} as FC<ReturnType<typeof usePercussion>>)
