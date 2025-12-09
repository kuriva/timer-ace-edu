import { cn } from '@/lib/utils';
import { TimerState, TimerUrgency } from '@/hooks/useTimer';

interface ProgressBarProps {
  progress: number;
  state: TimerState;
  urgency: TimerUrgency;
}

export function ProgressBar({ progress, state, urgency }: ProgressBarProps) {
  const getBarColor = () => {
    if (state === 'idle') return 'bg-timer-idle';
    if (state === 'finished') return 'bg-timer-danger';
    switch (urgency) {
      case 'danger': return 'bg-timer-danger';
      case 'warning': return 'bg-timer-warning';
      default: return 'bg-timer-safe';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000 ease-linear rounded-full',
            getBarColor()
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
        <span>0%</span>
        <span>{Math.round(progress)}% elapsed</span>
        <span>100%</span>
      </div>
    </div>
  );
}
