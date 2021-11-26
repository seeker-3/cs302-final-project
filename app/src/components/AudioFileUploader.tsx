import { ChangeEventHandler, forwardRef, useState } from 'react'

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

type Props = ReturnType<typeof useAudioFileUploader>

export default forwardRef<HTMLInputElement, Props>(function AudioFileUploader(
  { handleChange },
  ref
) {
  return <input ref={ref} type="file" onChange={handleChange} />
})
