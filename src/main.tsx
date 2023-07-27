import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {SongsProvider} from "./context/songsContext";
import { invoke } from "@tauri-apps/api";
import { log } from "console";
import { useAppStore } from "./store/store";

const startup = async () => {
  const audioFilesSearch = invoke("get_audio_files").then((result) => {
    const audioFiles = result as string[];
    console.log("Audio files", audioFiles);
    console.log(`Found ${audioFiles.length} audio files`);
    useAppStore.getState().setFiles(audioFiles);
  });
};

startup();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SongsProvider>
        <App />
    </SongsProvider>
  </React.StrictMode>
);
