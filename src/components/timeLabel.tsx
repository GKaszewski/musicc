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
    const {duration, position} = useAudioPosition({highRefreshRate: true})
    if (duration === Infinity) return null

    return <div className="text-sm text-white">{`${formatTime(position)} / ${formatTime(duration)}`}</div>
}

export default TimeLabel
