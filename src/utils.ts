import { fs } from "@tauri-apps/api";
import { Cover } from "./types";

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