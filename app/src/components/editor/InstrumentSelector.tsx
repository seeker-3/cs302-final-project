import { FC } from 'react'
import { UseInstrumentSelector } from '../../context/AudioContext'

export default (function InstrumentSelector({
  index,
  list,
  storeName,
  handleSelect,
}) {
  const placeholder = list.length
    ? 'select instrument'
    : `no ${storeName} exist`

  return (
    <select
      className="width2"
      name={`${storeName}-instrument`}
      disabled={!list.length}
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
} as FC<UseInstrumentSelector & { storeName: string }>)
