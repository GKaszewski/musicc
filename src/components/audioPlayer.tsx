import { FC, useEffect, useState } from "react";
import React from "react";
import { useAudioPlayer } from "react-use-audio-player";
import TimeLabel from "./timeLabel";
import {
	FaPause,
	FaPlay,
	FaStepBackward,
	FaStepForward,
	FaVolumeMute,
	RxLoop,
	RxShuffle,
	RxSpeakerModerate,
} from "react-icons/all";
import VolumeSlider from "./volumeSlider";
import { useAppStore } from "../store/store";
import {
	ButtonGroup,
	Flex,
	Grid,
	GridItem,
	IconButton,
} from "@chakra-ui/react";
import { getDirName } from "../utils";

const AudioPlayer: FC = () => {
	const { songs, currentSong, setCurrentSong, setSongs, songsPaths } =
		useAppStore((state) => state);

	const { play, pause, stop, mute, playing, ready, ended } = useAudioPlayer({
		src: songs[currentSong]?.audioUrl,
		format: ["mp3", "wav", "ogg", "flac"],
		autoplay: true,
		html5: true,
	});

	const [muted, setMuted] = useState(false);
	const [loop, setLoop] = useState(false);

	const hasNext = currentSong + 1 < songs.length;
	const hasPrev = currentSong - 1 >= 0;

	useEffect(() => {
		mute(muted);
	}, [muted, mute]);

	useEffect(() => {
		if (ended && loop) {
			play();
		} else if (ended && hasNext) {
			handleNext();
		} else if (ended && !hasNext) {
			stop();
		}
	}, [ended]);

	const handlePlay = () => {
		if (playing) {
			pause();
		} else {
			play();
		}
	};

	const handleLoop = () => {
		setLoop((prev) => !prev);
	};

	const handleNext = () => {
		if (currentSong + 1 < songs.length) {
			setCurrentSong(currentSong + 1);
		} else {
			stop();
		}
	};

	const handlePrev = () => {
		if (currentSong - 1 >= 0) {
			setCurrentSong(currentSong - 1);
		} else {
			stop();
		}
	};

	const handleShuffle = () => {
		const shuffled = songs.sort(() => 0.5 - Math.random());
		setSongs(shuffled);
	};

	const getTitle = () => {
		if (songs.length == 0 || !songsPaths[currentSong]) {
			return "";
		}
		const title = songs[currentSong]?.metadata?.title;

		if (!title || title.toLowerCase() == "unknown title") {
			return getDirName(songsPaths[currentSong]);
		}

		return title;
	};

	const getArtist = () => {
		if (songs.length == 0) {
			return "-";
		}

		const artist = songs[currentSong]?.metadata?.artist;
		if (!artist || artist.toLowerCase() == "unknown artist") {
			return "-";
		}

		return artist;
	};

	const getAlbum = () => {
		if (songs.length == 0) {
			return "-";
		}

		const album = songs[currentSong]?.metadata?.album;
		if (!album || album.toLowerCase() == "unknown album") {
			return "-";
		}

		return album;
	};

	return (
		<React.Fragment>
			{ready && (
				<Flex direction="column" alignItems="center">
					<p className="text-white">{getTitle()}</p>
					<p className="text-white italic">{getArtist()}</p>
					<p className="text-white font-semibold">{getAlbum()}</p>
					<Grid templateColumns="1fr 1fr 1fr" gap="4">
						<GridItem></GridItem>
						<ButtonGroup variant="ghost" spacing="4">
							<IconButton
								isRound
								aria-label="Shuffle"
								onClick={handleShuffle}
								colorScheme="blackAlpha"
								icon={<RxShuffle />}
							/>
							<IconButton
								isRound
								aria-label="previous song"
								onClick={handlePrev}
								colorScheme="blackAlpha"
								icon={<FaStepBackward />}
								disabled={!hasPrev}
							/>
							<IconButton
								isRound
								aria-label={playing ? "pause" : "play"}
								onClick={handlePlay}
								colorScheme="blackAlpha"
								icon={playing ? <FaPause /> : <FaPlay />}
							/>
							<IconButton
								isRound
								aria-label="next song"
								onClick={handleNext}
								colorScheme="blackAlpha"
								icon={<FaStepForward />}
								disabled={!hasNext}
							/>
							<IconButton
								isRound
								aria-label="loop"
								onClick={handleLoop}
								colorScheme="blackAlpha"
								icon={<RxLoop />}
								variant={loop ? "solid" : "ghost"}
							/>
						</ButtonGroup>
						<Flex>
							<VolumeSlider />
							<IconButton
								isRound
								onClick={() => setMuted((prev) => !prev)}
								colorScheme="blackAlpha"
								aria-label="mute"
								variant={muted ? "solid" : "ghost"}
								icon={
									muted ? (
										<FaVolumeMute />
									) : (
										<RxSpeakerModerate />
									)
								}
							/>
						</Flex>
					</Grid>
					<TimeLabel />
				</Flex>
			)}
		</React.Fragment>
	);
};

export default AudioPlayer;
