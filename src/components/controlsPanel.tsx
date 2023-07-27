import {FC} from "react";
import AudioPlayer from "./audioPlayer";

const ControlsPanel: FC = () => {
    return <div className="w-full min-h-[10rem] p-2 flex flex-col bg-red-400 select-none shadow-lg">
        <AudioPlayer />
    </div>
}

export default ControlsPanel;
