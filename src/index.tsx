import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './RecordAudio'
import reportWebVitals from './reportWebVitals'
import './scss/presets.scss'
import { register } from './serviceWorkerRegistration'
import { WasmRuntimeProvider } from './WasmRuntimeContext'

render(
  <StrictMode>
    <WasmRuntimeProvider>
      <App />
    </WasmRuntimeProvider>
  </StrictMode>,
  document.getElementById('root'),
)
register()
reportWebVitals()

// window.onload = () => {
// window.onbeforeunload = event => {
//   event.preventDefault()
//   return 'warning'
// }

// window.addEventListener(
//   'beforeunload',
//   event => {
//     event.preventDefault()
//     return (event.returnValue = 'Are you sure you want to exit?')
//   },
//   { capture: true },
// )
// }
