export type Metadata = {
	title: string;
	artist: string;
	album: string;
	cover: Cover;
};

export type Cover = {
	mime_type: string;
	data: string;
}

export type Song = {
	audioUrl: string;
	coverUrl?: string | null;
	metadata: Metadata | null;
	path: string;
}

export type Playlist = {
	name: string;
	songs: Song[];
}

export enum Screens {
	Home = "Home",
	Library = "Library",
	Settings = "Settings",
	Playlists = "Playlists",
	Search = "Search",
	Loading = "Loading",
}

export type StreamAudioFileResult = {
	data: Uint8Array;
	read_bytes: number;
}

export type AudioSearchResult = {
	files: string[];
}