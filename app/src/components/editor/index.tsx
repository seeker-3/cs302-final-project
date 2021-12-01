import {
  createContext,
  useContext,
  type FC,
  type MouseEventHandler,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  type UseFileSelector,
  type UseInstrumentSelector,
} from '../../context/AudioContext'
import { type AudioFileStores } from '../../db/indexedDB'
import AudioFileDeleter from './AudioFileDeleter'
import AudioFilePlayer from './AudioFilePlayer'
import AudioFileProcessor from './AudioFileProcessor'
import AudioFileSelector from './AudioFileSelector'
import InstrumentSelector from './InstrumentSelector'

type EditorProps = {
  title: string
  render?: (props: { audioFile: File | null }) => ReturnType<FC>
}

type EditorContextValue = {
  storeName: AudioFileStores
  playerAudio: Blob | null
  audioFile: File | null
  files: UseFileSelector
  instruments: UseInstrumentSelector
  fileDeleter?: Partial<{
    disabled: boolean
    callback: MouseEventHandler<HTMLButtonElement>
  }>
  fileProcessor?: Partial<{
    disabled: boolean
    handler: MouseEventHandler<HTMLButtonElement>
  }>
  fileSelector?: Partial<{
    disabled: boolean
  }>
  instrumentSelector?: Partial<{
    disabled: boolean
  }>
}

const EditorContext = createContext<EditorContextValue | null>(null)

export const useEditor = (): EditorContextValue => {
  const editorContext = useContext(EditorContext)
  if (!editorContext) throw Error('this component must be a child of editor')
  return editorContext
}

export default (function AudioEditor({ title, render, children, ...props }) {
  return (
    <EditorContext.Provider value={props}>
      <div className="column grow">
        <p>{title}</p>
        <div className="column align-items-start">
          <div className="row">
            <ErrorBoundary
              fallback={<p className="center">audio file selector crashed</p>}
            >
              <AudioFileSelector />
            </ErrorBoundary>
            <ErrorBoundary
              fallback={<p className="center">audio file processor crashed</p>}
            >
              <AudioFileProcessor />
            </ErrorBoundary>
            <ErrorBoundary
              fallback={<p className="center">audio file deleter crashed</p>}
            >
              <AudioFileDeleter />
            </ErrorBoundary>
          </div>
          <div className="row">
            <ErrorBoundary
              fallback={<p className="center">audio file player crashed</p>}
            >
              <AudioFilePlayer />
            </ErrorBoundary>
            <ErrorBoundary
              fallback={<p className="center">instrument selector crashed</p>}
            >
              <InstrumentSelector />
            </ErrorBoundary>
          </div>
        </div>
        <div className="grow">
          <ErrorBoundary
            fallback={<p className="center">editor body crashed</p>}
          >
            {render && render(props)}
            {children}
          </ErrorBoundary>
        </div>
      </div>
    </EditorContext.Provider>
  )
} as FC<EditorProps & EditorContextValue>)
