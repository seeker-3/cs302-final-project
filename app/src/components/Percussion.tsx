import {
  addBeat,
  addDrum,
  drumArrays,
  handleFileInputChange,
  pauseTrack,
  playTrack,
  removeBeat,
  removeDrum,
} from '@dothum/percussion'
import { ChangeEventHandler, FC, useState } from 'react'

export const usePercussion = () => {
  const [drums, setDrums] = useState([...drumArrays])
  const [playing, setPlaying] = useState(false)

  const reloadDrumState = () => {
    setDrums([...drumArrays])
  }

  const handleUpload: ChangeEventHandler<HTMLInputElement> | undefined =
    async e => {
      await handleFileInputChange(e)
      reloadDrumState()
    }

  const handlePlayState = () => {
    if (playing) pauseTrack()
    else playTrack()
    setPlaying(!playing)
  }

  const handleAddDrum = () => {
    addDrum()
    reloadDrumState()
  }

  const handleAddBeat = () => {
    addBeat()
    reloadDrumState()
  }

  const handleRemoveBeat = () => {
    removeBeat()
    reloadDrumState()
  }

  return {
    drums,
    playing,
    reloadDrumState,
    handleUpload,
    handlePlayState,
    handleAddDrum,
    handleAddBeat,
    handleRemoveBeat,
  }
}

export default (function () {
  const {
    drums,
    playing,
    reloadDrumState,
    handleUpload,
    handlePlayState,
    handleAddDrum,
    handleAddBeat,
    handleRemoveBeat,
  } = usePercussion()

  return (
    <>
      <input type="file" onChange={handleUpload} />
      <button onClick={handlePlayState}>{playing ? 'pause' : 'play'}</button>
      <button onClick={handleAddBeat}>add beat</button>
      <button onClick={handleRemoveBeat}>remove beat</button>
      <button onClick={handleAddDrum}>add drum</button>
      {drums.map((beats, i) => (
        <div key={i}>
          <button
            className="bg-red"
            onClick={() => {
              removeDrum(i)
              reloadDrumState()
            }}
          >
            remove drum
          </button>
          {beats.map((beat, j) => (
            <button
              className="m-16"
              key={j}
              style={{ background: beat ? '#333' : '#ccc' }}
              onClick={() => {
                drumArrays[i][j] = drumArrays[i][j] ? 0 : 1
                reloadDrumState()
              }}
            />
          ))}
        </div>
      ))}
    </>
  )
} as FC)
