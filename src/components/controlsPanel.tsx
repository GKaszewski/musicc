import {FC} from "react";
import AudioPlayer from "./audioPlayer";

interface Props {
    src: string;
}

const ControlsPanel: FC<Props> = ({src}) => {
    return <div className="w-full min-h-[10rem] p-2 flex flex-col bg-red-400 select-none shadow-lg">
        <AudioPlayer src={src} />
    </div>
}

export default ControlsPanel;
