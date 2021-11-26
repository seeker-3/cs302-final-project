import createAsyncContext from './createAsyncContext'

const [MediaDeviceProvider, useMediaDevice] = createAsyncContext<MediaStream>(
  () =>
    navigator.mediaDevices.getUserMedia({
      audio: true,
    })
)

export { MediaDeviceProvider }
export default useMediaDevice
