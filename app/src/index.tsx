import { StrictMode } from 'react'
import { render } from 'react-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './app'
import ContextProvider from './context'

render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('app')
)

registerSW()
