import { fs, invoke } from "@tauri-apps/api";
import { Cover, StreamAudioFileResult } from "./types";

export const getBase64Url = (data: Cover) => {
	if (!data) return null;
	if (!data.mime_type || !data.data) return null;

	return `data:${data.mime_type};base64,${data.data}`;
}

export const getDirName = (dirPath: string) => {
	const split = dirPath.split("\\");
	return split[split.length - 1];
};


export async function createUrlFromFilePath(selected: string) {
	const fileData = await fs.readBinaryFile(selected);
	const blob = new Blob([fileData], { type: "audio/mpeg" });
	const url = URL.createObjectURL(blob);
	return url;
}

export async function readFileInChunks(selected: string) {
	let start = 0;
	const chunkSize = 1024;
  
	const audioContext = new AudioContext();
	let sourceNode;
  
	while (true) {
	  const { data, read_bytes }: StreamAudioFileResult = await invoke('stream_audio_file', { filePath: selected, start, end: start + chunkSize });
	  console.log("Result:", data, read_bytes);
	  if (read_bytes === 0) {
		break;
	  }
  
	  const audioData = new Float32Array(data.buffer);
	  if (audioData.length > 0) {
		const audioBuffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
		audioBuffer.copyToChannel(audioData, 0);
	
		if (sourceNode) {
		  sourceNode.stop();
		}
		sourceNode = audioContext.createBufferSource();
		sourceNode.buffer = audioBuffer;
		sourceNode.connect(audioContext.destination);
		sourceNode.start();
	  }
	
	  start += read_bytes;
	  console.log(sourceNode);
	}
  }