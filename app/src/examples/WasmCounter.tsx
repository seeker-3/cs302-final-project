import init, { Counter } from '@dothum/wasm'
import { FC, useEffect, useState } from 'react'

export default (function Count() {
  const [count, setCount] = useState(0)
  const [counter, setCounter] = useState<Counter | null>(null)

  useEffect(() => {
    let counter: Counter | null = null

    void (async () => {
      await init()
      counter = Counter.new()
      setCounter(counter)
      setCount(counter.get_count())
    })().catch(console.error)

    return () => counter?.free()
  }, [setCounter])

  if (!counter) return null

  const increment = () => {
    counter.increment()
    setCount(counter.get_count())
  }

  const button = <button onClick={increment}>count</button>

  return (
    <div>
      <p>{count}</p>
      <p>you can {button} on me</p>
    </div>
  )
} as FC)
