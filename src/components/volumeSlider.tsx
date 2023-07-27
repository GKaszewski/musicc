import {useAudioPlayer} from "react-use-audio-player";
import {ChangeEvent, useCallback} from "react";
import {FaVolumeUp} from "react-icons/all";
import { Icon, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";

const VolumeSlider = () => {
    const {volume} = useAudioPlayer();

    const handleChange = useCallback(((value: number) => {
        const val =  parseFloat((Number(value) / 100).toFixed(2))
        return volume(val)
    }), [volume])

    return (
		<div className="w-full min-w-[4rem] flex items-center gap-2 mx-4">
			<Icon color="blackAlpha.600" fontSize="xl">
				<FaVolumeUp />
			</Icon>
			<Slider
				colorScheme="white"
				defaultValue={100}
				onChange={handleChange}
				min={0}
				max={100}
			>
				<SliderTrack bg="red.600">
					<SliderFilledTrack bg="white" />
				</SliderTrack>
				<SliderThumb />
			</Slider>
		</div>
	);
}

export default VolumeSlider
