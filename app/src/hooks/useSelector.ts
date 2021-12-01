import { useEffect, useState, type ChangeEventHandler } from 'react'

export type UseSelector<T> = {
  selected?: T
  index?: number
  list: T[]
  handleSelect: ChangeEventHandler<HTMLSelectElement>
}

export default function useSelector<T>(list: T[]): UseSelector<T> {
  const [selected, setSelected] = useState<T | undefined>(list[0])

  // reset the input if the list changes
  useEffect(() => {
    setSelected(list[0])
  }, [list])

  const handleSelect: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const selected = list[parseInt(target.value)]
    if (!selected) throw Error('selected file not found')
    setSelected(selected)
  }

  return {
    selected,
    index: selected && list.indexOf(selected),
    list,
    handleSelect,
  }
}
