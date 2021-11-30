import { type FC } from 'react'
import { useEditor } from '.'

const PLACEHOLDER = 'select instrument'

export default (function InstrumentSelector() {
  const {
    storeName,
    audioFile,
    instruments: { index, list, handleSelect },
    instrumentSelector: { disabled } = {},
  } = useEditor()

  return (
    <select
      className="width2"
      name={`${storeName}-instrument`}
      disabled={disabled || !audioFile || !list.length}
      value={index ?? PLACEHOLDER}
      onChange={handleSelect}
    >
      <>
        <option value={PLACEHOLDER} disabled hidden>
          {PLACEHOLDER}
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
