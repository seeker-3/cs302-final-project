import { StrictMode } from 'react'
import { render } from 'react-dom'
import { registerSW } from 'virtual:pwa-register'
import ContextProvider from './context'
import Layout from './layout'

render(
  <StrictMode>
    <ContextProvider>
      <Layout />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('app')
)

registerSW()
