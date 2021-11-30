import { useEffect, type FC } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { convertBufferToNotes } from '../../../../packages/pitch-finder/src/primitive'
import useAudioFilesIndexedDB from '../../context/AudioFilesIndexedDBContext'
import useBanner from '../../context/BannerContext'

export interface FileSaverFormInterface {
  filename: string
  filetype: 'tune' | 'beat'
  fileData: FileList
}

export type FileSaverForm = UseFormReturn<FileSaverFormInterface>

export default (function AudioFileSaver({ render, children }) {
  const form: FileSaverForm = useForm<FileSaverFormInterface>({
    defaultValues: {
      filetype: 'tune',
      filename: 'hello.mp3',
      fileData: undefined,
    },
  })
  const {
    register,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    watch,
    reset,
  } = form
  const { errors } = formState

  const { saveAudioFile } = useAudioFilesIndexedDB()

  const { setMessage } = useBanner()

  const onSubmit = handleSubmit(async ({ filename, filetype, fileData }) => {
    const [fileInput] = fileData

    // these shouldn't happen but in case the uncontrolled components get out of sync
    if (!fileInput) throw Error('received empty file')

    const storeName =
      filetype === 'tune' ? 'tunes' : filetype === 'beat' ? 'beats' : null

    if (!storeName) throw Error('received invalid filetype')

    // rename file
    const file = new File([fileInput], filename, {
      type: fileInput.type,
    })

    const isTune = filetype === 'tune'

    if (isTune) setMessage('processing tune. this may take a minute')

    const fields = isTune
      ? { notes: await convertBufferToNotes(await file.arrayBuffer()) }
      : {}

    const result = await saveAudioFile(storeName, {
      ...fields,
      file,
    })

    // success
    if (result) return reset()

    setError(
      'filename',
      {
        message: `error: ${filetype} with that name already exists`,
      },
      {
        shouldFocus: true,
      }
    )
  })

  // flash error to user with the banner
  useEffect(() => {
    const errors = Object.values(formState.errors)
    if (!errors.length) return
    for (const { message } of errors) {
      if (message) setMessage(message)
    }
    clearErrors()
  }, [formState, clearErrors, setMessage])

  const registerOptions = {
    required: true,
    disabled: !watch('fileData')?.length,
    deps: ['fileData'],
  }

  return (
    <form className="row" onSubmit={onSubmit}>
      {children ?? (render && render(form))}
      <input
        type="text"
        placeholder={errors.filename ? 'please enter a filename' : 'filename'}
        {...register('filename', {
          ...registerOptions,
          // pattern: /.+\.[mp3|wav|ogg|opus]/,
        })}
      />
      <button disabled={registerOptions.disabled}>save</button>
      <label>
        tune
        <input
          type="radio"
          value="tune"
          defaultChecked
          {...register('filetype', registerOptions)}
        />
      </label>
      <label>
        beat
        <input
          type="radio"
          value="beat"
          {...register('filetype', registerOptions)}
        />
      </label>
    </form>
  )
} as FC<{
  action: 'recording' | 'upload'
  render?: <T extends { fileSaverForm: FileSaverForm }>(
    fileSaverForm: FileSaverForm
  ) => ReturnType<FC<T>>
}>)
