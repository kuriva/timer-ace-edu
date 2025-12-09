import { GraduationCap } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerControls } from '@/components/TimerControls';
import { DurationSelector } from '@/components/DurationSelector';
import { ProgressBar } from '@/components/ProgressBar';

const Index = () => {
  const timer = useTimer({
    initialMinutes: 60,
    warningThresholdMinutes: 10,
    dangerThresholdMinutes: 5,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center gap-3 py-6 border-b border-border/50">
        <GraduationCap className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Exam Timer</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-10 animate-fade-in">
        {/* Timer Display */}
        <TimerDisplay
          formattedTime={timer.formattedTime}
          state={timer.state}
          urgency={timer.urgency}
        />

        {/* Progress Bar */}
        <ProgressBar
          progress={timer.progress}
          state={timer.state}
          urgency={timer.urgency}
        />

        {/* Controls */}
        <TimerControls
          state={timer.state}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />

        {/* Duration Selector */}
        <div className="w-full max-w-xl">
          <DurationSelector
            state={timer.state}
            onSetDuration={timer.setDuration}
            currentMinutes={Math.floor(timer.totalTime / 60)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border/50">
        Keep focused. Good luck on your exam!
      </footer>
    </div>
  );
};

export default Index;
