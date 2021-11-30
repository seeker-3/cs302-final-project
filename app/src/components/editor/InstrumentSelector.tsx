import { type FC } from 'react'
import { useEditor } from '.'

export default (function InstrumentSelector() {
  const {
    storeName,
    audioFile,
    instruments: { index, list, handleSelect },
    instrumentSelector: { disabled } = {},
  } = useEditor()
  const placeholder = 'select instrument'

  return (
    <select
      className="width2"
      name={`${storeName}-instrument`}
      disabled={disabled || !audioFile || !list.length}
      value={index ?? placeholder}
      onChange={handleSelect}
    >
      <>
        <option value={placeholder} disabled hidden>
          {placeholder}
        </option>
        {list.map((instrument, i) => (
          <option key={i} value={i}>
            {instrument}
          </option>
        ))}
      </>
    </select>
  )
} as FC)
