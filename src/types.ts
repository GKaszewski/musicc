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
	metadata: Metadata | null;
}

export enum Screens {
	Home = "Home",
	Library = "Library",
	Settings = "Settings",
	Playlists = "Playlists",
	Search = "Search",
	Loading = "Loading",
}