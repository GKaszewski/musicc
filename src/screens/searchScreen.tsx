import { Divider, Heading, IconButton, Input, InputGroup, InputRightAddon, Link, Skeleton } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useAppStore, useSettingsStore } from "../store/store";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { AudioSearchResult, Metadata, Song } from "../types";
import { createUrlFromFilePath, getBase64Url, getDirName } from "../utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";

const SearchScreen = () => {
    const {isSearchingForSongs, searchResults, setSearchResults, setIsSearchingForSongs} = useAppStore(state => state);
    const { setSongs, setIsLoadingSong, setCurrentSong } = useAppStore(state => state);
	const { stop } = useGlobalAudioPlayer();
    
    const {directories} = useSettingsStore(state => state);
    const [query, setQuery] = useState("");


	const handleClick = (songPath: string) => {
		loadSong(songPath);
	}

	const loadSong = (songPath: string) => {
		setSongs([]);
		setCurrentSong(-1);
		stop();
		setIsLoadingSong(true);
		Promise.all([
			invoke("get_metadata", { filePath: songPath }),
			createUrlFromFilePath(songPath),
		]).then(([metadata, url]) => {
			const coverUrl = getBase64Url((metadata as Metadata).cover);
			const song: Song = {
				audioUrl: url,
				metadata: metadata as Metadata,
				coverUrl,
				path: songPath,
			};
			setSongs([song]);
			setCurrentSong(0);
			setIsLoadingSong(false);
		});
	}


    useEffect(() => {
        setSearchResults([]);
    }, []);

    useEffect(() => {
        search(query);
    }, [query]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setQuery(query);
        if (query == "") {
            setSearchResults([]);
            return;
        }
    }

    const handleSearchClick = () => {
        search(query);
    }

    const search = async (query: string) => {
        if (query == "" || query == null) {
            return;
        }
        setIsSearchingForSongs(true);
        invoke<AudioSearchResult>("search_audio_files", {dirs: directories, query: query}).then((result) => {
            setSearchResults(result.files);
            setIsSearchingForSongs(false);
        });
    }

    return <div className="w-full h-full flex flex-col items-center">
        <Heading fontFamily="Roboto">Search</Heading>
        <div className="w-full flex p-8 sm:p-2">
            <InputGroup>
                <Input value={query} onChange={handleSearch} placeholder="Search for audio file" />
                <InputRightAddon>
                    <IconButton onClick={handleSearchClick} aria-label="Search" icon={<FaSearch />} />
                </InputRightAddon>
            </InputGroup>
        </div>
        <Divider  />
        {isSearchingForSongs && <div className="w-full flex flex-col overflow-y-auto h-full min-h-[4rem] gap-2">
            <Skeleton height="4rem" />
            <Skeleton height="4rem" />
            <Skeleton height="4rem" />
        </div>}
        {!isSearchingForSongs && <div className="w-full flex flex-col overflow-y-auto h-60 min-h-[4rem] gap-2 p-4">
            {searchResults && searchResults.map((result, i) => {
                return <Link onClick={()=>{
                    handleClick(result);
                }} href="#" key={`${result}-${i}`}>{getDirName(result)}</Link>
            })}
        </div>}
    </div>
}

export default SearchScreen;