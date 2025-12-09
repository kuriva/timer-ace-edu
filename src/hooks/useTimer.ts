import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerState = 'idle' | 'running' | 'paused' | 'finished';
export type TimerUrgency = 'safe' | 'warning' | 'danger';

interface UseTimerProps {
  initialMinutes?: number;
  warningThresholdMinutes?: number;
  dangerThresholdMinutes?: number;
}

interface UseTimerReturn {
  timeRemaining: number;
  totalTime: number;
  state: TimerState;
  urgency: TimerUrgency;
  progress: number;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
}

export function useTimer({
  initialMinutes = 60,
  warningThresholdMinutes = 10,
  dangerThresholdMinutes = 5,
}: UseTimerProps = {}): UseTimerReturn {
  const [totalTime, setTotalTime] = useState(initialMinutes * 60);
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const [state, setState] = useState<TimerState>('idle');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (state === 'finished') return;
    setState('running');
  }, [state]);

  const pause = useCallback(() => {
    if (state === 'running') {
      setState('paused');
    }
  }, [state]);

  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(totalTime);
    setState('idle');
  }, [clearTimer, totalTime]);

  const setDuration = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    setTotalTime(seconds);
    setTimeRemaining(seconds);
    setState('idle');
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [state, clearTimer]);

  const urgency: TimerUrgency = (() => {
    if (state === 'idle') return 'safe';
    const minutesRemaining = timeRemaining / 60;
    if (minutesRemaining <= dangerThresholdMinutes) return 'danger';
    if (minutesRemaining <= warningThresholdMinutes) return 'warning';
    return 'safe';
  })();

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const formattedTime = (() => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  return {
    timeRemaining,
    totalTime,
    state,
    urgency,
    progress,
    formattedTime,
    start,
    pause,
    reset,
    setDuration,
  };
}
