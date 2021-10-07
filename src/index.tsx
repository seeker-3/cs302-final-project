import styled from '@emotion/styled'
import { FC, useState } from 'react'
import { render } from 'react-dom'
import './scss/presets.scss'

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

render(<App />, document.getElementById('root'))
