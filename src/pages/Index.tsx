import { useExamTimer } from '@/hooks/useExamTimer';
import { CurrentTimeDisplay } from '@/components/CurrentTimeDisplay';
import { ExamList } from '@/components/ExamList';
import { ExamControls } from '@/components/ExamControls';

const Index = () => {
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
        />
      </main>
    </div>
  );
};

export default Index;
