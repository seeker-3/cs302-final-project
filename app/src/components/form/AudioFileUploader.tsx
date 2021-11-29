import { ChangeEventHandler, FC, useState } from 'react'
import { FileSaverForm } from './AudioFileSaverForm'

const audioMIMETypeRegex = /^audio\/.+$/

export const useAudioFileUploader = () => {
  const [audioUpload, setAudioUpload] = useState<File | null>(null)

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (!target?.files) return
    setAudioUpload(target.files[0])
  }

  return {
    audioUpload,
    handleChange,
  }
}

export default (function AudioFileUploader({
  register,
  setValue,
  setError,
  clearErrors,
}) {
  return (
    <>
      <input style={{ display: 'none' }} />
      <input
        type="file"
        {...register('fileData', {
          required: true,
          onChange: ({ target }) => {
            const file = target?.files[0]
            if (!file) return
            const validMIMETypes = file.type.match(audioMIMETypeRegex)

            if (!validMIMETypes) {
              target.files = new DataTransfer().files
              setError(
                'fileData',
                {
                  message: `Invalid file type: ${file.type}. File must be an audio file.`,
                },
                {
                  shouldFocus: true,
                }
              )
              return
            }

            clearErrors('fileData')

            setValue('filename', file.name)
          },
          validate: ([file]) => !!(file && file.type.match(audioMIMETypeRegex)),
        })}
      />
    </>
  )
} as FC<FileSaverForm>)
