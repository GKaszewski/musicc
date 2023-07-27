import { Box, Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";
import {useAudioPosition} from "react-use-audio-player";

const formatTime = (seconds: number) => {
    const floored = Math.floor(seconds)
    let from = 14
    let length = 5
    if (floored >= 3600) {
        from = 11
        length = 8
    }

    return new Date(floored * 1000).toISOString().substr(from, length)
}

const TimeLabel = () => {
    const {duration, position, seek} = useAudioPosition({highRefreshRate: true})
    if (duration === Infinity) return null

    const handleSeek = (value: number) => {
        console.log("Seeking to", value)
        seek(value)
    }

    return (
		<div className="w-1/2 mx-16 flex items-center">
			<Text fontFamily="Roboto" fontSize="sm" color="white">
				{formatTime(position)}
			</Text>
			<Slider
				rounded="full"
				width="full"
				marginX="5"
				value={position}
                max={duration}
                onChange={handleSeek}
			>
				<SliderTrack bg="red.600">
					<SliderFilledTrack bg="red.100" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                    <Box color="red.400" as={MdGraphicEq} />
                </SliderThumb>
			</Slider>
			<Text fontFamily="Roboto"  fontSize="sm" color="white">
				{formatTime(duration)}
			</Text>
		</div>
	);
}

export default TimeLabel
