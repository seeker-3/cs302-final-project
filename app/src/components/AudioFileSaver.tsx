import { FC } from 'react'
import { useForm } from 'react-hook-form'
import useAudioFiles from '../context/AudioFilesContext'

interface SaveAction {
  filename: string
  filetype: 'tune' | 'beat'
}

export default (function FileSaver({ audioBlob, children, name = '' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SaveAction>()

  const { saveAudioFile } = useAudioFiles()

  const onSubmit = handleSubmit(async ({ filename, filetype }) => {
    if (!audioBlob) throw Error('tried to save file with no audio data')

    const result = await saveAudioFile(
      filetype === 'tune' ? 'tunes' : 'beats',
      new File([audioBlob], filename)
    )

    // success
    if (result) return

    setError(
      'filename',
      {
        message: 'filename with that name already exists',
      },
      {
        shouldFocus: true,
      }
    )
  })

  const disabled = !audioBlob

  return (
    <form className="row" onSubmit={onSubmit}>
      {children}
      <input
        type="text"
        defaultValue={name}
        placeholder={errors.filename?.message ?? 'filename'}
        disabled={disabled}
        {...register('filename', { required: true })}
      />
      <button disabled={disabled}>save</button>
      <label>
        tune
        <input
          defaultChecked
          type="radio"
          value="tune"
          disabled={disabled}
          {...register('filetype')}
        />
      </label>
      <label>
        beat
        <input
          type="radio"
          value="beat"
          disabled={disabled}
          {...register('filetype', {})}
        />
      </label>
    </form>
  )
} as FC<{
  action: 'recording' | 'upload'
  audioBlob: Blob | null
  name?: string
}>)
