import { useCallback, useState } from "react";
import { use1Second } from "./use1Second";

export const useTimer = ({
    seconds: initialSeconds = 0,
    running: initiallyRunning = false
} = {}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [running, setRunning] = useState(initiallyRunning);
    const tick = useCallback(
        () => (running ? setSeconds((seconds) => seconds + 1) : undefined),
        [running]
    );
    const start = () => setRunning(true);
    const pause = () => setRunning(false);
    const reset = () => setSeconds(0);
    const stop = () => {
        pause();
        reset();
    };

    use1Second(tick);

    return { pause, reset, running, seconds, start, stop };
};
