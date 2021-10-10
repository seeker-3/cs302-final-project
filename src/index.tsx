import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './scss/presets.scss'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { WasmRuntimeProvider } from './WasmRuntimeContext'

render(
  <StrictMode>
    <WasmRuntimeProvider>
      <App />
    </WasmRuntimeProvider>
  </StrictMode>,
  document.getElementById('root'),
)

serviceWorkerRegistration.register()
reportWebVitals()
