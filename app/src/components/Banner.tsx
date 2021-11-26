import { FC, useEffect, useState } from 'react'

export default (function Banner() {
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState('error')
  useEffect(() => {
    if (!mounted) return

    const closeBanner = () => setMounted(false)

    const closeEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeBanner()
    }

    const timeout = setTimeout(closeBanner, 2000)

    window.addEventListener('keydown', closeEvent)

    return () => {
      if (timeout) clearTimeout(timeout)
      window.removeEventListener('keydown', closeEvent)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="banner">
      <p className="grow">{message}</p>
      <button
        className="square-button"
        onClick={() => setMounted(false)}
        onKeyDown={event => {
          console.log(event)
        }}
      >
        X
      </button>
    </div>
  )
} as FC)
