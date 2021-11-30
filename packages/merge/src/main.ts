// npm install crunker
import Crunker from "crunker";
const crunker = new Crunker();

const mergedBlob = async () => {
  const buffers = await crunker.fetchAudio("C-major.wav", "C-major2.wav");
  const mergedBuffers = await crunker.mergeAudio(buffers);
  const output = await crunker.export(mergedBuffers, "audio/wav");
  return output.blob;
}