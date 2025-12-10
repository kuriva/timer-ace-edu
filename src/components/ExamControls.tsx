import { Play, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExamControlsProps {
  isAnyRunning: boolean;
  hasExams: boolean;
  onStart: () => void;
  onReset: () => void;
  onFullscreen: () => void;
}

export function ExamControls({ isAnyRunning, hasExams, onStart, onReset, onFullscreen }: ExamControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      {!isAnyRunning ? (
        <Button
          variant="timerStart"
          size="xl"
          onClick={onStart}
          disabled={!hasExams}
          className="min-w-[160px]"
        >
          <Play className="w-5 h-5" />
          Start All
        </Button>
      ) : (
        <>
          <Button
            variant="timerReset"
            size="xl"
            onClick={onReset}
            className="min-w-[160px]"
          >
            <RotateCcw className="w-5 h-5" />
            Reset All
          </Button>
          <Button
            variant="default"
            size="xl"
            onClick={onFullscreen}
            className="min-w-[160px]"
          >
            <Maximize2 className="w-5 h-5" />
            Fullscreen
          </Button>
        </>
      )}
    </div>
  );
}
