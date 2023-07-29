import { PropsWithChildren } from "react";
import { createUrlFromFilePath, getBase64Url, getDirName } from "../utils";
import { useAppStore } from "../store/store";
import { LinkBox, LinkOverlay, Card, CardBody, Text, Icon } from "@chakra-ui/react";
import {BsFileMusic} from 'react-icons/bs'
import { invoke } from "@tauri-apps/api";
import { Metadata, Song } from "../types";
import { useAudioPlayer } from "react-use-audio-player";

interface Props extends PropsWithChildren {
	songPath: string;
}

const SongCard = ({ songPath, children }: Props) => {
	const { setSongs, setSongsPaths, setIsLoadingSong } = useAppStore(state => state);
	const { player } = useAudioPlayer();

	const handleClick = () => {
		loadSong();
	}

	const loadSong = () => {
		setSongs([]);
		setSongsPaths([]);
		player?.stop();
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
			};
			setSongs([song]);
			setSongsPaths([songPath]);
			setIsLoadingSong(false);
		});
	}

	return (
		<LinkBox>
			<LinkOverlay href="#" onClick={handleClick}>
				<Card size="sm" rounded="none">
					<CardBody>
						<div className="w-full h-full flex flex-col items-center justify-center mx-auto">
							<Icon boxSize="20" as={BsFileMusic} />
							<Text isTruncated fontFamily="Roboto">
								{getDirName(songPath)}
							</Text>
						</div>
					</CardBody>
				</Card>
			</LinkOverlay>
		</LinkBox>
	);
}


export default SongCard;