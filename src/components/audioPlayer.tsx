import {FC, useEffect, useState} from "react";
import React from "react";
import {useAudioPlayer} from "react-use-audio-player";
import TimeLabel from "./timeLabel";
import {
    FaPause,
    FaPlay,
    FaStepBackward,
    FaStepForward,
    FaVolumeMute,
    FaVolumeUp,
    RxLoop,
    RxShuffle, RxSpeakerModerate
} from "react-icons/all";
import VolumeSlider from "./volumeSlider";
import {useSongs, useSongsUpdate} from "../context/songsContext";

interface Props {
    src: string
}

const AudioPlayer: FC<Props> = ({src}) => {
    const {play, pause, stop, mute, playing, ready, ended} = useAudioPlayer({
        src: src,
        format: ['mp3', 'wav', 'ogg', 'flac'],
        autoplay: true,
        html5: true,
    });

    const [muted, setMuted] = useState(false)
    const [loop, setLoop] = useState(false)
    const {songsUrls, currentSong, songsMetadata} = useSongs();
    const {setCurrentSong, setSongsUrls} = useSongsUpdate();

    const hasNext = currentSong + 1 < songsUrls.length;
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
    }

    const handleLoop = () => {
        setLoop(prev => !prev);
    }

    const handleNext = () => {
        if (currentSong + 1 < songsUrls.length) {
            setCurrentSong(currentSong + 1);
        } else {
            stop();
        }
    }

    const handlePrev = () => {
        if (currentSong - 1 >= 0) {
            setCurrentSong(currentSong - 1);
        } else {
            stop();
        }
    }

    const handleShuffle = () => {
        const shuffled = songsUrls.sort(() => 0.5 - Math.random());
        setSongsUrls(shuffled);
    }

    return <React.Fragment>
        {ready && <div className="w-full m-2 flex flex-col items-center">
            <p>{ songsMetadata[currentSong].title}</p>
            <div className="w-full grid grid-cols-3 grid-rows-1 justify-center text-white p-2">
                <span />
                <div className="w-full items-center justify-center flex gap-5">
                    <button aria-label="Shuffle" type="button" onClick={handleShuffle}><RxShuffle/></button>
                    <button aria-label="Previous song" type="button" onClick={handlePrev}><FaStepBackward/></button>
                    <button aria-label={ playing ? "pause" : "play"} type="button" onClick={handlePlay}> {playing ? <FaPause/> : <FaPlay/>} </button>
                    <button aria-label="next song" type="button" onClick={handleNext}><FaStepForward/></button>
                    <button aria-label="loop" type="button" onClick={handleLoop}><RxLoop/></button>
                </div>
                <div className="flex gap-2">
                    <VolumeSlider />
                    <button onClick={() => setMuted(prev => !prev)}>{muted ? <FaVolumeMute/> : <RxSpeakerModerate />}</button>
                </div>
            </div>
            <TimeLabel/>
        </div>}
    </React.Fragment>
}

export default AudioPlayer
