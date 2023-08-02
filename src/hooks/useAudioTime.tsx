import { useEffect, useRef, useState } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";

const useAudioTime = () => {
    const frameRef = useRef<number>(0);
    const [pos, setPos] = useState<number>(0);
    const [percentComplete, setPercentComplete] = useState<number>(0);
    const [ended, setEnded] = useState<boolean>(false);
    const { getPosition, duration } = useGlobalAudioPlayer();

    useEffect(() => {
        const animate = () => {            
            setPos(getPosition());
            frameRef.current = requestAnimationFrame(animate);
            if (duration === Infinity || duration === 0 || isNaN(duration)) {
                setPercentComplete(0);
            } else {
                setPercentComplete((getPosition() / duration) * 100);
            }
            setEnded(getPosition() === duration);
            
        }

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                window.cancelAnimationFrame(frameRef.current);
            }
        }
    }, [getPosition]);



    return { pos, percentComplete, ended};
}

export default useAudioTime;