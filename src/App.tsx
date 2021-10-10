import styled from '@emotion/styled'
import { FC, useMemo, useState } from 'react'
import useWasmRuntime from './WasmRuntimeContext'

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
    margin: 0;
    padding: 0;
    display: inline-block;
    color: inherit;
    background-color: inherit;
    outline: none;
    text-decoration: underline;
  }
`

export default (function App() {
  const { Counter } = useWasmRuntime()
  const counter = useMemo(() => Counter.new(), [Counter])
  const [count, setCount] = useState(counter.get_count())

  const button = (
    <button
      onClick={() => {
        counter.increment()
        setCount(counter.get_count())
      }}
    >
      count
    </button>
  )

  return (
    <StyledDiv>
      <p>{count}</p>
      <p>you can {button} on me</p>
    </StyledDiv>
  )
} as FC)
