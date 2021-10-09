import styled from '@emotion/styled'
import { FC, StrictMode, useState } from 'react'
import { render } from 'react-dom'
import reportWebVitals from './reportWebVitals'
import './scss/presets.scss'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const StyledP = styled.p`
  margin-top: 8rem;
  display: block;
  text-align: center;
  button {
    display: inline-block;
    color: inherit;
    background-color: inherit;
    outline: none;
    text-decoration: underline;
  }
`

const App: FC = () => {
  const [count, setCount] = useState(0)

  const button = (
    <button onClick={() => setCount(count + 1)}>count {count}</button>
  )

  return <StyledP>you can {button} on me</StyledP>
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
)

serviceWorkerRegistration.register()
reportWebVitals()
