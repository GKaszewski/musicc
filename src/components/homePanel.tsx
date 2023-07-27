import {FC} from "react";
import MusicArt from "./musicArt";
import AudioSeek from "./audioSeek";

interface Props {
    artSrc: string | null | undefined;
}
const HomePanel: FC<Props> = ({artSrc}) => {
    return <div className="w-full h-full flex flex-col justify-center items-center relative">
        <AudioSeek indicatorColor="#EF4444" indicatorWidth={5} trackColor="#D1D5DB" trackWidth={5} />
        <MusicArt artSrc={artSrc} />
    </div>

}

export default HomePanel;
