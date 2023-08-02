import {useAudioPlayer, useGlobalAudioPlayer} from "react-use-audio-player";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import useAudioTime from "../hooks/useAudioTime";

interface Props {
    trackWidth: number;
    trackColor: string;
    indicatorWidth: number;
    indicatorColor: string;
}

const AudioSeek: FC<Props> = (props) => {
    const {trackWidth, trackColor, indicatorWidth, indicatorColor} = props;

    const {playing, duration, seek} = useGlobalAudioPlayer();
    const {percentComplete} = useAudioTime();

    const seekBarElement = useRef<SVGSVGElement>(null);

    const center = 160 / 2,
        radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
        dashArray = 2 * Math.PI * radius,
        dashOffset = dashArray * ((100 - percentComplete) / 100);


    const goTo = useCallback((event: any) => {
        if (seekBarElement.current) {
            const rect = seekBarElement.current.getBoundingClientRect();
            const x = event.clientX - rect.left - center;
            const y = event.clientY - rect.top - center;
            let angle = Math.atan2(y, x) + Math.PI / 2;
            const offsetAngle = -Math.PI / 2 + (Math.PI / 180) * 90;
            angle = angle - offsetAngle;
            if (angle < 0) {
                angle = Math.PI * 2 + angle;
            }

            const percent = angle / (Math.PI * 2);
            seek(percent * duration);
        }

    }, [duration, playing, seek])

    return (
        <svg onClick={goTo} ref={seekBarElement} className="absolute w-40 h-40 -rotate-90">
            <circle cx={center} cy={center} r={radius} fill="transparent" strokeWidth={trackWidth} stroke={trackColor}/>
            <circle cx={center} cy={center} r={radius} fill="transparent" strokeLinecap="round"
                    strokeWidth={indicatorWidth} stroke={indicatorColor} strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}/>
        </svg>
    )
}

export default AudioSeek;
