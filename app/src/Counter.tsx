// @ts-ignore
import styled from '@emotion/styled'
import init, { Counter } from 'dothum-wasm'
import { FC, useEffect, useState } from 'react'

const StyledDiv = styled.div`
  margin-top: 8rem;
  p:first-of-type {
    font-size: 4rem;
  }
  p {
    font-size: 2rem;
    display: block;
    text-align: center;
  }
  button {
    color: #874ffe;
    margin: 0;
    padding: 0;
    display: inline-block;
    background-color: inherit;
    outline: none;
  }
`

export default (function Count() {
  const [count, setCount] = useState(0)
  const [counter, setCounter] = useState<Counter | null>(null)

  useEffect(() => {
    let counter: Counter | null = null

    init().then(() => {
      counter = Counter.new()
      setCounter(counter)
      setCount(counter.get_count())
    })
    return () => {
      counter?.free()
    }
  }, [setCounter])

  if (!counter) return null

  const increment = () => {
    counter.increment()
    setCount(counter.get_count())
  }

  const button = <button onClick={increment}>count</button>

  return (
    <StyledDiv>
      <p>{count}</p>
      <p>you can {button} on me</p>
    </StyledDiv>
  )
} as FC)
