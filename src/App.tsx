import DisableContext from "./components/disableContext";
import { dialog, invoke } from "@tauri-apps/api";
import { useEffect, useRef } from "react";
import NavBar from "./components/navBar";
import ControlsPanel from "./components/controlsPanel";
import HomePanel from "./components/homePanel";
import { getMatches } from "@tauri-apps/api/cli";
import { Metadata, Screens, Song } from "./types";
import { AppState, useAppStore } from "./store/store";
import FilesScreen from "./screens/filesScreen";
import { createUrlFromFilePath, getBase64Url, readFileInChunks } from "./utils";
import { listen } from "@tauri-apps/api/event";
import Preferences from "./screens/preferences";
import PlaylistScreen from "./screens/playlistsScreen";
import SearchScreen from "./screens/searchScreen";

function App() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		currentScreen,
		currentSong,
		setSongs,
		setCurrentSong,
        appendSong,
		songs,
		setIsLoadingSong,
	} = useAppStore((state: AppState) => state);

	const handleOpen = async () => {
		//fileInputRef.current?.click();

		const result = await dialog.open({
			multiple: true,
			filters: [
				{ name: "Audio", extensions: ["mp3", "wav", "ogg", "flac"] },
			],
		});

		if (result) {
			console.log("Audio result: ", result);
			handleAudioFile(result);
			setCurrentSong(0);
		}
	};

	const handleAudioFile = (result: string[] | string | null) => {
		if (!result) return;
		setIsLoadingSong(true);
		setCurrentSong(-1);
		if (result instanceof Array) {
			setSongs([]);
			readFileInChunks(result[0]);
			result.forEach(async (filePath: string) => {
				Promise.all([
					invoke("get_metadata", { filePath: filePath }),
					createUrlFromFilePath(filePath),
				]).then(([metadata, url]) => {
					const coverUrl = getBase64Url((metadata as Metadata).cover);
					const song: Song = {
						audioUrl: url,
						metadata: metadata as Metadata,
						coverUrl,
						path: filePath,
					};
                    appendSong(song);
					setIsLoadingSong(false);
				});
			});
		} else {
			readFileInChunks(result);
			Promise.all([
				invoke("get_metadata", { filePath: result }),
				createUrlFromFilePath(result),
			]).then(([metadata, url]) => {
                const coverUrl = getBase64Url((metadata as Metadata).cover);
				const song: Song = {
                    audioUrl: url,
                    coverUrl,
					metadata: metadata as Metadata,
					path: result,
				};
				setSongs([song]);
				setIsLoadingSong(false);
			});
		}
		setCurrentSong(0);
	};

	useEffect(() => {
		getMatches().then((matches) => {
			const audioPath = matches.args["audio_files"].value;
			if (audioPath) {
				handleAudioFile(audioPath as string);
			}
		});

		const handleFileDrop = async () => {
			const unsubscribe = await listen(
				"tauri://file-drop",
                (event) => {
                    const result = event.payload as string[] | string | null;
                    handleAudioFile(result);
                }
			);
			return unsubscribe;
		};

		let unsubscribe: any;
		handleFileDrop().then((unsub) => {
			unsubscribe = unsub;
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
				console.log("Unsubscribed from file drop event");
			}
		};
	}, []);

	return (
		<div className="w-full h-screen flex flex-col bg-gray-100">
				<DisableContext />
				<input
					ref={fileInputRef}
					type="file"
					accept="audio/*"
					multiple={true}
					hidden={true}
				/>
				{currentScreen == Screens.Home && (
					<HomePanel artSrc={songs[currentSong!]?.coverUrl || null} />
				)}
				{currentScreen == Screens.Library && <FilesScreen />}
				{currentScreen == Screens.Settings && <Preferences />}
				{currentScreen == Screens.Playlists && <PlaylistScreen />}
				{currentScreen == Screens.Search && <SearchScreen />}
				<span className="flex-1" />
				<ControlsPanel />
				<NavBar />
			</div>
	);
}

export default App;
