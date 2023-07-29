import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Playlist, Screens, Song } from "../types";

export interface AppState {
    currentScreen: Screens;
    files: string[];
    currentSong: number;
    songs: Song[];
    selectedDirectory: string;
    songsPaths: string[];
    isSearchingForSongs: boolean;
    playingQueue: Song[];
    previousPlayedSongs: Song[];
    isLoadingSong: boolean;
    setFiles: (files: string[]) => void;
    setCurrentSong: (songIndex: number) => void;
    setSongs: (songs: Song[]) => void;
    setSong: (song: Song, index: number) => void;
    appendSong: (song: Song) => void;
    setScreen: (screen: Screens) => void;
    setSelectedDirectory: (directory: string) => void;
    setSongsPaths: (paths: string[]) => void;
    appendSongPath: (path: string) => void;
    setIsSearchingForSongs: (isSearching: boolean) => void;
    setPlayingQueue: (queue: Song[]) => void;
    setPreviousPlayedSongs: (songs: Song[]) => void;
    setIsLoadingSong: (isLoading: boolean) => void;
    resetStore: () => void;
}

export interface PlaylistState {
    playlists: Playlist[];
    currentPlaylist: Playlist;
    setPlaylists: (playlists: Playlist[]) => void;
    setCurrentPlaylist: (playlist: Playlist) => void;
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
            isSearchingForSongs: false,
            playingQueue: [],
            previousPlayedSongs: [],
            isLoadingSong: false,
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
            setIsSearchingForSongs: (isSearching) => set({ isSearchingForSongs: isSearching }),
            setPlayingQueue: (queue) => set({ playingQueue: queue }),
            setPreviousPlayedSongs: (songs) => set({ previousPlayedSongs: songs }),
            resetStore: () => set({
                currentScreen: Screens.Home,
                files: [],
                currentSong: 0,
                songs: [],
                selectedDirectory: "",
                songsPaths: [],
                isSearchingForSongs: false,
                playingQueue: [],
                previousPlayedSongs: [],
            }),
            setIsLoadingSong: (isLoading) => set({ isLoadingSong: isLoading }),
        }),
        {
            name: "app-storage",
        }
    )
));


export const usePlaylistStore = create<PlaylistState>()(devtools(
    persist(
        (set) => ({
            playlists: [],
            currentPlaylist: {
                name: "",
                songs: [],
            },
            setPlaylists: (playlists) => set({ playlists }),
            setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
        }),
        {
            name: "playlist-storage",
        }
    )
));