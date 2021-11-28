import { FC } from 'react'
import useBanner from '../context/BannerContext'

export default (function Banner() {
  const { mounted, unmount, message } = useBanner()

  if (!mounted) return null

  return (
    <div className="banner">
      <p className="grow">{message}</p>
      <button onClick={unmount}>x</button>
    </div>
  )
} as FC)
