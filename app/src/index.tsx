import { StrictMode } from 'react'
import { render } from 'react-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './app'
import ContextProvider from './context'
import './scss/index.scss'

render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('app')
)

registerSW({
  immediate: true,
})
