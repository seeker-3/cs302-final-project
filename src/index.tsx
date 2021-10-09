// import '@dothum/wasm'
import { Counter } from '@dothum/wasm'
import styled from '@emotion/styled'
import { FC, StrictMode, useEffect, useState } from 'react'
import { render } from 'react-dom'
import reportWebVitals from './reportWebVitals'
import './scss/presets.scss'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const StyledDiv = styled.div`
  margin-top: 8rem;
  p {
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

const StyledP = styled.p`
  font-size: 4rem;
`

const App: FC = () => {
  const [counter, setCounter] = useState<Counter | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    let counter: Counter | null = null

    void (async () => {
      const { Counter } = await import('@dothum/wasm')
      counter = Counter.new()
      setCounter(counter)
    })()

    return () => counter?.free()
  }, [])

  if (!counter) return null

  const button = (
    <button onClick={() => setCount(counter.increment())}>count</button>
  )

  return (
    <StyledDiv>
      <StyledP>{count}</StyledP>
      <p>you can {button} on me</p>
    </StyledDiv>
  )
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
)

serviceWorkerRegistration.register()
reportWebVitals()
