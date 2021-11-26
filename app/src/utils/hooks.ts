import { useEffect, useRef, useState } from 'react'

export const useAsyncState = <T>(callback: () => Promise<T>) => {
  const [state, setState] = useState<T | null>(null)

  useEffect(
    () => void (async () => setState(await callback()))().catch(console.error),
    [callback]
  )

  return state
}

export const useAudioSource = () => {
  const audioRef = useRef<HTMLMediaElement>(null)

  useEffect(() => {
    if (!audioRef?.current) return

    const audioContext = new AudioContext()
    const gainNode = audioContext.createGain()
    const source = audioContext.createMediaElementSource(audioRef.current)

    source.connect(gainNode)
    gainNode.connect(audioContext.destination)
  }, [audioRef])

  return audioRef
}

// unused
export const useLocalStorage = (
  key: string,
  initialState: string | null = null,
  save = true
) => {
  const [storedState, setStoredState] = useState<string | null>(
    localStorage.getItem(key) ?? initialState
  )

  useEffect(() => {
    if (!storedState || !save) return
    localStorage.setItem(key, storedState)
  }, [storedState, key, save])
  const deleteStoredData = () => {
    localStorage.removeItem(key)
    setStoredState(null)
  }

  return [storedState, setStoredState, deleteStoredData] as [
    typeof storedState,
    typeof setStoredState,
    typeof deleteStoredData
  ]
}
