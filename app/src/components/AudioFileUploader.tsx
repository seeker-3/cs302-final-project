import { ChangeEventHandler, FC, useState } from 'react'
import { FileSaverForm } from './AudioFileSaverForm'

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

export default (function AudioFileUploader({ register, setValue }) {
  return (
    <>
      <input style={{ display: 'none' }} />
      <input
        type="file"
        {...register('fileData', {
          required: true,
          onChange: ({ target }) => {
            const filename = target?.files && target.files[0]?.name
            if (!filename) return
            setValue('filename', filename)
          },
        })}
      />
    </>
  )
} as FC<FileSaverForm>)
