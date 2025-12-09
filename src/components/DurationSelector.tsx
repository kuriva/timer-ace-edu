import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimerState } from '@/hooks/useTimer';

interface DurationSelectorProps {
  state: TimerState;
  onSetDuration: (minutes: number) => void;
  currentMinutes: number;
}

const PRESET_DURATIONS = [15, 30, 45, 60, 90, 120];

export function DurationSelector({ state, onSetDuration, currentMinutes }: DurationSelectorProps) {
  const [customMinutes, setCustomMinutes] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes, 10);
    if (minutes > 0 && minutes <= 480) {
      onSetDuration(minutes);
      setCustomMinutes('');
    }
  };

  const isDisabled = state === 'running';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="text-sm uppercase tracking-widest">Set Duration</span>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {PRESET_DURATIONS.map((minutes) => (
          <Button
            key={minutes}
            variant={currentMinutes === minutes ? 'timer' : 'outline'}
            size="lg"
            onClick={() => onSetDuration(minutes)}
            disabled={isDisabled}
            className="min-w-[80px]"
          >
            {minutes < 60 ? `${minutes}m` : `${minutes / 60}h${minutes % 60 > 0 ? ` ${minutes % 60}m` : ''}`}
          </Button>
        ))}
      </div>

      <form onSubmit={handleCustomSubmit} className="flex items-center justify-center gap-3">
        <Input
          type="number"
          placeholder="Custom (min)"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          disabled={isDisabled}
          min={1}
          max={480}
          className="w-36 bg-secondary/50 border-border text-center font-mono"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={isDisabled || !customMinutes}
        >
          Set
        </Button>
      </form>
    </div>
  );
}
