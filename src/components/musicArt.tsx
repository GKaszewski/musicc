import {FC} from "react";
import artImage from "../assets/musical-note.webp";
import {useGlobalAudioPlayer} from "react-use-audio-player";

interface Props {
    artSrc: string | null | undefined;
}

const MusicArt: FC<Props> = ({artSrc}) => {
    const {playing, play, pause} = useGlobalAudioPlayer()
    const art = artSrc ? artSrc : artImage;

    const handleArtClick = () => {
        if (playing) {
            pause();
        } else {
            play();
        }
    }

    return <div className="z-30 select-none">
        <img onClick={handleArtClick} src={art} alt="Album Art" className={`w-32 h-32 rounded-full shadow-xl ${playing ? 'animate-spin' : 'animate-none'}`} />
    </div>
}

export default MusicArt;
