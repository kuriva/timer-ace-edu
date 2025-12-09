import { cn } from '@/lib/utils';
import { TimerState, TimerUrgency } from '@/hooks/useTimer';

interface TimerDisplayProps {
  formattedTime: string;
  state: TimerState;
  urgency: TimerUrgency;
}

export function TimerDisplay({ formattedTime, state, urgency }: TimerDisplayProps) {
  const getGlowClass = () => {
    if (state === 'idle') return 'timer-glow-idle';
    if (state === 'finished') return 'timer-glow-danger';
    switch (urgency) {
      case 'danger': return 'timer-glow-danger';
      case 'warning': return 'timer-glow-warning';
      default: return 'timer-glow-safe';
    }
  };

  const getTextClass = () => {
    if (state === 'idle') return 'text-timer-idle';
    if (state === 'finished') return 'text-timer-danger';
    switch (urgency) {
      case 'danger': return 'text-timer-danger';
      case 'warning': return 'text-timer-warning';
      default: return 'text-timer-safe';
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 md:p-12 transition-all duration-500',
        getGlowClass()
      )}
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          {state === 'finished' ? 'Time\'s Up!' : state === 'idle' ? 'Ready' : state === 'paused' ? 'Paused' : 'Time Remaining'}
        </p>
        <div
          className={cn(
            'font-mono text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight transition-colors duration-500',
            getTextClass()
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
