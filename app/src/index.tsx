import { StrictMode } from 'react'
import { render } from 'react-dom'
// @ts-ignore
import { registerSW } from 'virtual:pwa-register'
import Count from './Counter'
import RecordAudio from './RecordAudio'

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

// const App: FC = () => {
//   return <RecordAudio />
// }

render(
  <StrictMode>
    {/* <WasmRuntimeProvider> */}
    <RecordAudio />
    <Count />
    {/* </WasmRuntimeProvider> */}
  </StrictMode>,
  document.getElementById('root'),
)
// register()
// reportWebVitals()

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
