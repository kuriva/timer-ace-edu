import { format } from 'date-fns';
import { Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamState } from '@/types/exam';

interface FullscreenViewProps {
  exams: ExamState[];
  currentTime: Date;
  onExit: () => void;
}

export function FullscreenView({ exams, currentTime, onExit }: FullscreenViewProps) {
  const dayName = format(currentTime, 'EEEE');
  const monthDay = format(currentTime, 'MMMM d');
  const time = format(currentTime, 'h:mm a');

  const getPhaseBar = (exam: ExamState) => {
    if (exam.currentPhase === 'perusal') {
      const totalSeconds = exam.perusalMinutes * 60;
      const elapsedSeconds = totalSeconds - exam.perusalRemaining;
      const elapsedPercent = (elapsedSeconds / totalSeconds) * 100;
      const remainingMinutes = Math.ceil(exam.perusalRemaining / 60);
      
      return (
        <div className="w-full">
          <div className="bg-timer-safe text-foreground text-center py-3 font-bold text-2xl md:text-3xl">
            PERUSAL {remainingMinutes} min{remainingMinutes !== 1 ? 's' : ''}
          </div>
          <div className="h-3 bg-muted">
            <div 
              className="h-full bg-timer-safe transition-all duration-1000"
              style={{ width: `${elapsedPercent}%` }}
            />
          </div>
        </div>
      );
    }
    
    if (exam.currentPhase === 'planning') {
      const totalSeconds = exam.planningMinutes * 60;
      const elapsedSeconds = totalSeconds - exam.planningRemaining;
      const elapsedPercent = (elapsedSeconds / totalSeconds) * 100;
      const remainingMinutes = Math.ceil(exam.planningRemaining / 60);
      
      return (
        <div className="w-full">
          <div className="bg-purple-400 text-foreground text-center py-3 font-bold text-2xl md:text-3xl">
            PLANNING {remainingMinutes} min{remainingMinutes !== 1 ? 's' : ''}
          </div>
          <div className="h-3 bg-muted">
            <div 
              className="h-full bg-purple-400 transition-all duration-1000"
              style={{ width: `${elapsedPercent}%` }}
            />
          </div>
        </div>
      );
    }

    if (exam.currentPhase === 'warning') {
      const remainingMinutes = Math.ceil(exam.workingRemaining / 60);
      const elapsedSeconds = 600 - exam.workingRemaining;
      const elapsedPercent = (elapsedSeconds / 600) * 100;
      
      return (
        <div className="w-full">
          <div className="bg-timer-warning text-foreground text-center py-3 font-bold text-2xl md:text-3xl animate-pulse">
            {remainingMinutes} MINUTE{remainingMinutes !== 1 ? 'S' : ''} REMAINING
          </div>
          <div className="h-3 bg-muted">
            <div 
              className="h-full bg-timer-warning transition-all duration-1000"
              style={{ width: `${elapsedPercent}%` }}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Sort exams same as ExamList
  const sortedExams = [...exams].sort((a, b) => {
    const aInPrePhase = a.currentPhase === 'perusal' || a.currentPhase === 'planning';
    const bInPrePhase = b.currentPhase === 'perusal' || b.currentPhase === 'planning';

    if (aInPrePhase && !bInPrePhase) return -1;
    if (!aInPrePhase && bInPrePhase) return 1;

    if (aInPrePhase && bInPrePhase) {
      const aRemaining = a.currentPhase === 'perusal' ? a.perusalRemaining : a.planningRemaining;
      const bRemaining = b.currentPhase === 'perusal' ? b.perusalRemaining : b.planningRemaining;
      return aRemaining - bRemaining;
    }

    if ((a.currentPhase === 'working' || a.currentPhase === 'warning') &&
        (b.currentPhase === 'working' || b.currentPhase === 'warning')) {
      return a.workingRemaining - b.workingRemaining;
    }

    const phaseOrder = { perusal: 0, planning: 1, working: 2, warning: 3, finished: 4, idle: 5 };
    return phaseOrder[a.currentPhase] - phaseOrder[b.currentPhase];
  });

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-auto">
      {/* Exit button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onExit}
        className="absolute top-4 right-4 z-10 hover:bg-muted"
      >
        <Minimize2 className="h-6 w-6" />
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between w-full px-8 py-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">{dayName}</h1>
          <p className="text-2xl md:text-3xl text-foreground">{monthDay}</p>
        </div>
        <div className="text-7xl md:text-9xl font-bold text-navy font-mono">
          {time}
        </div>
      </div>

      {/* Exam Cards */}
      <div className="flex-1 px-8 pb-8 space-y-6">
        {sortedExams.map((exam) => (
          <div key={exam.id} className="border border-border bg-card rounded-lg overflow-hidden">
            {exam.isRunning && getPhaseBar(exam)}
            
            <div className="flex items-stretch">
              {/* Year and Test Details */}
              <div className="flex-1 flex items-center gap-6 p-6">
                <div className="text-5xl md:text-6xl font-bold text-primary font-mono">
                  {exam.year}
                </div>
                <div className="text-4xl md:text-5xl font-semibold text-foreground">
                  {exam.testDetails}
                </div>
              </div>

              {/* Finish Time */}
              <div className="flex flex-col items-center justify-center px-10 bg-primary text-primary-foreground">
                <span className="text-lg font-semibold uppercase tracking-wider">Finish</span>
                <span className="text-5xl md:text-6xl font-bold font-mono">
                  {exam.finishTime ? format(exam.finishTime, 'h:mm a') : '--:-- --'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
