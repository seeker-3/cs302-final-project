import { FC, useEffect, useMemo, useRef, useState } from 'react'
import useIndexedDB from './IndexedDBContext'
import PlayAudioFile from './PlayAudioFile'

// const useMediaRecorder = () => {
//   const db = useIndexedDB()
//   const [isRecording, setIsRecording] = useState(false)
//   const [isPaused, setIsPaused] = useState(false)
//   const [audioDataURL, setAudioDataURL] = useState<string | null>(null)

//   const [stream, setStream] = useState<MediaStream | null>(null)

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then(setStream)
//   }, [])

//   const mediaRecorder = useMemo(() => {
//     if (!stream) return null

//     const mediaRecorder = new MediaRecorder(stream, {})

//     mediaRecorder.ondataavailable = async ({ data }) => {
//       const audioData = new Blob([data], { type: 'audio/mpeg' })

//       setAudioDataURL(URL.createObjectURL(audioData))
//     }

//     return mediaRecorder
//   }, [setAudioDataURL, stream])

//   if (!mediaRecorder) return {}

//   const handleStartRecording = () => {
//     if (isRecording) mediaRecorder.stop()
//     else mediaRecorder.start()
//     setIsRecording(!isRecording)
//   }

//   const handlePauseRecording = () => {
//     if (isPaused) mediaRecorder.resume()
//     else mediaRecorder.pause()
//     setIsPaused(!isPaused)
//   }

//   const handleDeleteRecording = () => {
//     setAudioDataURL(null)
//   }

//   const handleSaveFile = async ({ target }: Event) => {}

//   return {
//     mediaRecorder,
//     audioDataURL,
//     isRecording,
//     isPaused,
//     handleStartRecording,
//     handlePauseRecording,
//     handleDeleteRecording,
//     handleSaveFile,
//   }
// }

export default (function RecordAudio() {
  const db = useIndexedDB()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(setStream)
  }, [setStream])

  const mediaRecorder = useMemo(() => {
    if (!stream) return null

    const mediaRecorder = new MediaRecorder(stream, {})

    mediaRecorder.ondataavailable = async ({ data }) => {
      const audioData = new Blob([data], { type: 'audio/mpeg' })
      new File([audioData], 'file', {
        type: 'audio/mpeg',
      })
      setAudioData(audioData)
    }

    return mediaRecorder
  }, [setAudioData, stream])

  if (!mediaRecorder) return null

  const handleStartRecording = () => {
    if (isRecording) mediaRecorder.stop()
    else mediaRecorder.start()
    setIsRecording(!isRecording)
  }

  const handlePauseRecording = () => {
    if (isPaused) mediaRecorder.resume()
    else mediaRecorder.pause()
    setIsPaused(!isPaused)
  }

  const handleDeleteRecording = () => {
    setAudioData(null)
  }

  const handleSaveFile = async () => {
    if (!inputRef?.current || !audioData) return

    const fileName = inputRef.current.value

    const file = new File([audioData], fileName, {
      type: 'audio/mpeg',
    })

    await db.put('audio-files', file)
  }

  if (!mediaRecorder) return null

  return (
    <div>
      <div className="row">
        <button
          className={isRecording ? 'bg-purple' : 'bg-green'}
          onClick={handleStartRecording}
        >
          {isRecording ? 'stop' : 'start'}
        </button>
        <button disabled={!isRecording} onClick={handlePauseRecording}>
          {isPaused ? 'resume' : 'pause'}
        </button>
        <button
          className={audioData ? 'bg-red' : ''}
          disabled={!audioData}
          onClick={handleDeleteRecording}
        >
          delete
        </button>
      </div>
      {audioData && (
        <>
          <PlayAudioFile audioData={audioData} />
          <input ref={inputRef} />
          <button />
        </>
      )}
    </div>
  )
} as FC)
