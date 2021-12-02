// npm install crunker
import Crunker from 'crunker'
const crunker = new Crunker()

export const mergedBlob = async () => {
  // fetchAudio(file1ToMerge, File2ToMerge)
  const buffers = await crunker.fetchAudio('C-major.wav', 'C-major2.wav')
  const mergedBuffers = await crunker.mergeAudio(buffers)
  // export(mergedBuffers, fileFormat)
  const output = await crunker.export(mergedBuffers, 'audio/wav')
  return output.blob
}
