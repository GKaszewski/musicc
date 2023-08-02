import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { invoke } from "@tauri-apps/api";
import { useAppStore, useSettingsStore } from "./store/store";
import { ChakraProvider } from "@chakra-ui/react";

const startup = async () => {
	useAppStore.getState().resetStore();
	useAppStore.getState().setIsSearchingForSongs(true);
	invoke("get_audio_files", {dirs: useSettingsStore.getState().directories}).then((result) => {
		const audioFiles = result as string[];
		console.log(`Found ${audioFiles.length} audio files`);
		useAppStore.getState().setFiles(audioFiles);
		useAppStore.getState().setIsSearchingForSongs(false);
	});
};

startup();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider>
			<App />
		</ChakraProvider>
	</React.StrictMode>
);
