import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimerState } from '@/hooks/useTimer';

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ state, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {state === 'running' ? (
        <Button
          variant="timerPause"
          size="xl"
          onClick={onPause}
          className="min-w-[140px]"
        >
          <Pause className="w-5 h-5" />
          Pause
        </Button>
      ) : (
        <Button
          variant="timerStart"
          size="xl"
          onClick={onStart}
          disabled={state === 'finished'}
          className="min-w-[140px]"
        >
          <Play className="w-5 h-5" />
          {state === 'paused' ? 'Resume' : 'Start'}
        </Button>
      )}
      
      <Button
        variant="timerReset"
        size="xl"
        onClick={onReset}
        className="min-w-[140px]"
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </Button>
    </div>
  );
}
