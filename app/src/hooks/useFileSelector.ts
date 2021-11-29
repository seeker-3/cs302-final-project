import { ChangeEventHandler, useState } from 'react'

export default function useFileSelector(files: File[]) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSelectFile: ChangeEventHandler<HTMLSelectElement> = ({
    target,
  }) => {
    const file = files.find(file => file.name === target.value)
    if (!file) throw Error('selected file not found')
    setSelectedFile(file)
  }

  return [files, selectedFile, handleSelectFile] as const
}

export type UseFileSelector = ReturnType<typeof useFileSelector>
