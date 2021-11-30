import { type FC } from 'react'
import { useEditor } from './index'

export default (function AudioFileSelector() {
  const {
    storeName,
    files: { index, list, handleSelect },
    fileSelector: { disabled } = {},
  } = useEditor()
  const placeholder = list.length ? 'select beat' : `no ${storeName} exist`

  return (
    <select
      className="text-width2"
      name={`${storeName}-file`}
      disabled={disabled || !list.length}
      value={index ?? placeholder}
      onChange={handleSelect}
    >
      <>
        <option value={placeholder} disabled hidden>
          {placeholder}
        </option>
        {list.map(({ file }, i) => (
          <option key={file.name} value={i}>
            {file.name}
          </option>
        ))}
      </>
    </select>
  )
} as FC)
