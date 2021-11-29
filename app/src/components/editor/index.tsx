import { createContext, FC, MouseEventHandler, useContext } from 'react'
import {
  UseFileSelector,
  UseInstrumentSelector,
} from '../../context/AudioContext'
import { AudioFileStores } from '../../db/indexedDB'
import AudioFileDeleter from './AudioFileDeleter'
import AudioFilePlayer from './AudioFilePlayer'
import AudioFileProcessor from './AudioFileProcessor'
import AudioFileSelector from './AudioFileSelector'
import InstrumentSelector from './InstrumentSelector'

type EditorContextValue = {
  title: string
  storeName: AudioFileStores
  playerAudio: Blob | null
  files: UseFileSelector
  instruments: UseInstrumentSelector
  render?: (props: { audioFile: File | null }) => ReturnType<FC>
  processorDisabled?: boolean
  handleProcess: MouseEventHandler<HTMLButtonElement>
}

const EditorContext = createContext<EditorContextValue | null>(null)

export const useEditor = (): EditorContextValue => {
  const editorContext = useContext(EditorContext)
  if (!editorContext) throw Error('editor context did not load properly')
  return editorContext
}

export default (function Editor(props) {
  const {
    title,
    storeName,
    playerAudio,
    instruments,
    files,
    handleProcess,
    processorDisabled = false,
    render,
    children,
  } = props
  const audioFile = files.selected

  return (
    <EditorContext.Provider value={props}>
      <div className="column grow">
        <p>{title}</p>
        <div className="column align-items-start">
          <div className="row">
            <AudioFileSelector storeName={storeName} {...files} />
            <AudioFileProcessor
              processorDisabled={processorDisabled}
              audioFile={files.selected}
              handleProcess={handleProcess}
            />
            <AudioFileDeleter storeName={storeName} audioFile={audioFile} />
          </div>
          <div className="row">
            <AudioFilePlayer audioFile={playerAudio} />
            <InstrumentSelector storeName={storeName} {...instruments} />
          </div>
        </div>
        <div className="grow">
          {render && render({ audioFile })}
          {children}
        </div>
      </div>
    </EditorContext.Provider>
  )
} as FC<EditorContextValue>)
