import { FC } from 'react'
import Editor from './Editor'
import Recorder from './Recorder'
import Uploader from './Uploader'

export default (function Layout() {
  return (
    <main className="column">
      <div className="column align-items-end">
        <Recorder />
        <Uploader />
      </div>
      <div className="column grow">
        <Editor title="Tune" storeName="tunes" />
        <Editor title="Beat" storeName="beats" />
      </div>
    </main>
  )
} as FC)
