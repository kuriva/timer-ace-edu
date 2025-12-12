import { Play, RotateCcw, Maximize2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExamControlsProps {
  isAnyRunning: boolean;
  hasExams: boolean;
  onStart: () => void;
  onReset: () => void;
  onFullscreen: () => void;
}

const handleDownloadHTML = async () => {
  try {
    const response = await fetch('/exam-timer.html');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-timer.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download HTML file:', error);
  }
};

export function ExamControls({ isAnyRunning, hasExams, onStart, onReset, onFullscreen }: ExamControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6 flex-wrap">
      {!isAnyRunning ? (
        <>
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
          <Button
            variant="outline"
            size="xl"
            onClick={handleDownloadHTML}
            className="min-w-[160px]"
          >
            <Download className="w-5 h-5" />
            Export HTML
          </Button>
        </>
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