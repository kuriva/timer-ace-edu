import { useState } from 'react';
import { useExamTimer } from '@/hooks/useExamTimer';
import { CurrentTimeDisplay } from '@/components/CurrentTimeDisplay';
import { ExamList } from '@/components/ExamList';
import { ExamControls } from '@/components/ExamControls';
import { FullscreenView } from '@/components/FullscreenView';

const Index = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    exams,
    currentTime,
    isAnyRunning,
    addExam,
    updateExam,
    removeExam,
    startAllExams,
    resetAllExams,
  } = useExamTimer();

  const handleFullscreen = () => {
    setIsFullscreen(true);
    document.documentElement.requestFullscreen?.();
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
    document.exitFullscreen?.();
  };

  if (isFullscreen) {
    return (
      <FullscreenView
        exams={exams}
        currentTime={currentTime}
        onExit={handleExitFullscreen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Current Time Header */}
      <CurrentTimeDisplay currentTime={currentTime} />

      {/* Main Content */}
      <main className="flex-1 py-6 animate-fade-in">
        <ExamList
          exams={exams}
          isAnyRunning={isAnyRunning}
          onAddExam={addExam}
          onUpdateExam={updateExam}
          onRemoveExam={removeExam}
        />

        {/* Controls */}
        <ExamControls
          isAnyRunning={isAnyRunning}
          hasExams={exams.length > 0}
          onStart={startAllExams}
          onReset={resetAllExams}
          onFullscreen={handleFullscreen}
        />
      </main>
    </div>
  );
};

export default Index;
