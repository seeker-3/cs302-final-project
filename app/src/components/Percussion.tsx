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
import useSelector from '../hooks/useSelector'

const PERCUSSION_INSTRUMENTS = ['hi-hat', 'snare', 'kick']

const castInstrumentToLiteral = (instrument?: string) => {
  const literal =
    instrument === 'hi-hat'
      ? PercussionInstruments.hiHat
      : instrument === 'snare'
      ? PercussionInstruments.snare
      : instrument === 'kick'
      ? PercussionInstruments.kick
      : null
  if (!literal)
    throw Error(`unrecognized drum label ${instrument} when casting to literal`)
  return literal
}

export const usePercussion = (audioFile: File | null) => {
  const [drums, updateLocalDrumState] = useReducer(
    () => [...drumArrays],
    drumArrays
  )

  const instrumentSelector = useSelector(PERCUSSION_INSTRUMENTS)

  const percussionInstrument = castInstrumentToLiteral(
    instrumentSelector.selected
  )

  const [playing, togglePlayState] = useReducer(state => !state, false)

  const loadDrum = async () => {
    if (!audioFile) return
    await inputAudioFile(audioFile, percussionInstrument)
    updateLocalDrumState()
  }

  const handlePlayState = () => {
    if (playing) pauseTrack()
    else playTrack()
    togglePlayState()
  }

  const handleAddDrum = () => {
    addDrum(percussionInstrument)
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
    drumArrays[index1].beats[index2] = drumArrays[index1].beats[index2] ? 0 : 1
    updateLocalDrumState()
  }

  return {
    instrumentSelector,
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

export default (function Percussion({
  instrumentSelector: { index, list, handleSelect },
  drums,
  playing,
  handlePlayState,
  handleAddDrum,
  handleRemoveDrum,
  handleAddBeat,
  handleRemoveBeat,
  toggleBeat,
  loadDrum,
  loadDrumsDisabled,
}) {
  const isDrum = !!drums[0]
  const numberOfBeats = drums[0]?.beats.length
  const isBeats = !!numberOfBeats

  return (
    <div className="column">
      <div className="row-center">
        <select
          name="drum-selector"
          className="width2"
          value={index}
          onChange={handleSelect}
        >
          {list.map((instrument, i) => (
            <option key={instrument} value={i}>
              {instrument}
            </option>
          ))}
        </select>
        <button className="width2" onClick={handleAddDrum}>
          add drum
        </button>
        <button
          className="width2"
          disabled={loadDrumsDisabled}
          onClick={loadDrum}
        >
          load file
        </button>
      </div>
      <div className="row-center">
        <button className="width2" onClick={handlePlayState}>
          {playing ? 'pause' : 'play'}
        </button>
        <button className="width2" disabled={!isDrum} onClick={handleAddBeat}>
          add beat
        </button>
        <button
          className="width2"
          disabled={!isBeats}
          onClick={handleRemoveBeat}
        >
          remove beat
        </button>
      </div>
      <div className="column-stretch">
        {numberOfBeats !== undefined && (
          <p className="text-center">beats: {numberOfBeats}</p>
        )}
        {drums.map(({ label, beats }, i) => (
          <div className="row-left contain" key={i}>
            <button
              className="width2 no-shrink"
              onClick={() => handleRemoveDrum(i)}
            >
              remove{` ${label}`}
            </button>
            <div className="drum-beats row-left wrap">
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
} as FC<ReturnType<typeof usePercussion> & { loadDrumsDisabled?: boolean }>)
