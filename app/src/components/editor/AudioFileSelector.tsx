import { FC } from 'react'
import { UseFileSelector } from '../../context/AudioContext'
import { useEditor } from './index'

export default (function AudioFileSelector() {
  // ? this is cool, but is it a good idea?
  const {
    storeName,
    files: { index, list, handleSelect },
  } = useEditor()
  const placeholder = list.length ? 'select beat' : `no ${storeName} exist`

  return (
    <select
      className="text-width2"
      name={`${storeName}-file`}
      disabled={!list.length}
      value={index ?? placeholder}
      onChange={handleSelect}
    >
      <>
        <option value={placeholder} disabled hidden>
          {placeholder}
        </option>
        {list.map((file, i) => (
          <option key={file.name} value={i}>
            {file.name}
          </option>
        ))}
      </>
    </select>
  )
} as FC<UseFileSelector & { storeName: string }>)
