import { FC, useEffect, useMemo, useState } from 'react'

const useAudioStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(setStream)
  }, [])

  return stream
}

// const useLocalStorage = (
//   key: string,
//   initialState: string | null = null,
//   save: boolean = true,
// ) => {
//   const [storedState, setStoredState] = useState<string | null>(
//     localStorage.getItem(key) ?? initialState,
//   )

//   useEffect(() => {
//     if (!storedState || !save) return
//     localStorage.setItem(key, storedState)
//   }, [storedState, key, save])
//   const deleteStoredData = () => {
//     localStorage.removeItem(key)
//     setStoredState(null)
//   }

//   return [storedState, setStoredState, deleteStoredData] as [
//     typeof storedState,
//     typeof setStoredState,
//     typeof deleteStoredData,
//   ]
// }

export default (function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioData, setAudioData] = useState<string | null>(null)

  const stream = useAudioStream()

  const mediaRecorder = useMemo(() => {
    if (!stream) return null
    const mediaRecorder = new MediaRecorder(stream, {})
    mediaRecorder.ondataavailable = async ({ data }) => {
      const audioData = new Blob([data], { type: 'audio/mpeg' })
      setAudioData(URL.createObjectURL(audioData))
    }
    return mediaRecorder
  }, [setAudioData, stream])

  if (!mediaRecorder) return null

  const handleRecord = () => {
    if (isRecording) mediaRecorder.stop()
    else mediaRecorder.start()
    setIsRecording(!isRecording)
  }

  const handlePause = () => {
    if (isPaused) mediaRecorder.resume()
    else mediaRecorder.pause()
    setIsPaused(!isPaused)
  }

  const handleDelete = () => {
    setAudioData(null)
  }

  return (
    <div>
      <div className="row">
        <button
          className={isRecording ? 'bg-purple' : 'bg-green'}
          onClick={handleRecord}
        >
          {isRecording ? 'stop' : 'start'}
        </button>
        <button disabled={!isRecording} onClick={handlePause}>
          {isPaused ? 'resume' : 'pause'}
        </button>
        <button
          className={audioData ? 'bg-red' : ''}
          disabled={!audioData}
          onClick={handleDelete}
        >
          delete
        </button>
      </div>
      {audioData && (
        <div className="row">
          <audio controls>
            <source src={audioData} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  )
} as FC)
