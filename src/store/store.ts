import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Screens, Song } from "../types";

export interface AppState {
    currentScreen: Screens;
    files: string[];
    currentSong: number;
    songs: Song[];
    selectedDirectory: string;
    songsPaths: string[];
    setFiles: (files: string[]) => void;
    setCurrentSong: (songIndex: number) => void;
    setSongs: (songs: Song[]) => void;
    setSong: (song: Song, index: number) => void;
    appendSong: (song: Song) => void;
    setScreen: (screen: Screens) => void;
    setSelectedDirectory: (directory: string) => void;
    setSongsPaths: (paths: string[]) => void;
    appendSongPath: (path: string) => void;
}

export const useAppStore = create<AppState>()(devtools(
    persist(
        (set) => ({
            currentScreen: Screens.Home,
            files: [],
            currentSong: 0,
            songs: [],
            selectedDirectory: "",
            songsPaths: [],
            setFiles: (files) => set({ files }),
            setCurrentSong: (songIndex) => set({ currentSong: songIndex }),
            setSongs: (songs) => set({ songs }),
            setSong: (song, index) => {
                const songs = [...useAppStore.getState().songs];
                songs[index] = song;
                set({ songs });
            },
            setScreen: (screen) => set({ currentScreen: screen }),
            appendSong: (song) => set((state) => ({ songs: [...state.songs, song] })),
            setSelectedDirectory: (directory) => set({ selectedDirectory: directory }),
            setSongsPaths: (paths) => set({ songsPaths: paths }),
            appendSongPath: (path) => set((state) => ({ songsPaths: [...state.songsPaths, path] })),
        }),
        {
            name: "app-storage",
        }
    )
));