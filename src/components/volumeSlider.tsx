import {useAudioPlayer} from "react-use-audio-player";
import {ChangeEvent, useCallback} from "react";
import {FaVolumeUp} from "react-icons/all";

const VolumeSlider = () => {
    const {volume} = useAudioPlayer();

    const handleChange = useCallback(((slider: ChangeEvent<HTMLInputElement>) => {
        const value =  parseFloat((Number(slider.target.value) / 100).toFixed(2))
        return volume(value)
    }), [volume])

    return (
        <div className="flex items-center text-white gap-2">
            <FaVolumeUp />
            <input
                className="text-white accent-white"
                type="range"
                min={0}
                max={100}
                onChange={handleChange}
                defaultValue={100}
            />
        </div>
    )
}

export default VolumeSlider
