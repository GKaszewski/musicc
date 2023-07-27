import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Screens, Song } from "../types";

interface AppState {
    currentScreen: Screens;
    files: string[];
    currentSong: Song;
    songs: Song[];
    setFiles: (files: string[]) => void;
    setCurrentSong: (song: Song) => void;
    setSongs: (songs: Song[]) => void;
    setSong: (song: Song, index: number) => void;
    setScreen: (screen: Screens) => void;
}

export const useAppStore = create<AppState>()(devtools(
    persist(
        (set) => ({
            currentScreen: Screens.Home,
            files: [],
            currentSong: {
                audioUrl: "",
                metadata: null,
            },
            songs: [],
            setFiles: (files) => set({ files }),
            setCurrentSong: (song) => set({ currentSong: song }),
            setSongs: (songs) => set({ songs }),
            setSong: (song, index) => {
                const songs = [...useAppStore.getState().songs];
                songs[index] = song;
                set({ songs });
            },
            setScreen: (screen) => set({ currentScreen: screen }),
        }),
        {
            name: "app-storage",
        }
    )
));