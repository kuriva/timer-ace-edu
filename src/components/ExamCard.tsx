import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamState } from '@/types/exam';
import { Button } from '@/components/ui/button';

interface ExamCardProps {
  exam: ExamState;
  onEdit: () => void;
  onRemove: () => void;
  isRunning: boolean;
}

export function ExamCard({ exam, onEdit, onRemove, isRunning }: ExamCardProps) {
  const getPhaseBar = () => {
    if (exam.currentPhase === 'perusal') {
      const totalSeconds = exam.perusalMinutes * 60;
      const remainingPercent = (exam.perusalRemaining / totalSeconds) * 100;
      return (
        <div className="w-full">
          <div className="bg-timer-safe text-primary-foreground text-center py-2 font-semibold text-lg">
            PERUSAL {exam.perusalMinutes} mins
          </div>
          <div className="h-2 bg-muted">
            <div 
              className="h-full bg-timer-safe transition-all duration-1000"
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
        </div>
      );
    }
    
    if (exam.currentPhase === 'planning') {
      const totalSeconds = exam.planningMinutes * 60;
      const remainingPercent = (exam.planningRemaining / totalSeconds) * 100;
      return (
        <div className="w-full">
          <div className="bg-purple-400 text-primary-foreground text-center py-2 font-semibold text-lg">
            PLANNING {exam.planningMinutes} mins
          </div>
          <div className="h-2 bg-muted">
            <div 
              className="h-full bg-purple-400 transition-all duration-1000"
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
        </div>
      );
    }

    if (exam.currentPhase === 'warning') {
      return (
        <div className="w-full">
          <div className="bg-timer-warning text-primary-foreground text-center py-2 font-semibold text-lg animate-pulse">
            10 MINUTES REMAINING
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden">
      {/* Phase bar at top */}
      {exam.isRunning && getPhaseBar()}
      
      <div className="flex items-stretch">
        {/* Edit button */}
        <div className="flex items-center justify-center px-2 border-r border-border">
          {!isRunning ? (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground uppercase">
              <Pencil className="h-4 w-4 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Year and Test Details */}
        <div className="flex-1 flex items-center gap-4 p-4">
          <div className="text-3xl md:text-4xl font-bold text-primary font-mono">
            {exam.year}
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-foreground">
            {exam.testDetails}
          </div>
        </div>

        {/* Finish Time */}
        <div className="flex flex-col items-center justify-center px-6 bg-primary text-primary-foreground">
          <span className="text-sm font-semibold uppercase tracking-wider">Finish</span>
          <span className="text-3xl md:text-4xl font-bold font-mono">
            {exam.finishTime ? format(exam.finishTime, 'h:mm a') : '--:-- --'}
          </span>
        </div>
      </div>
    </div>
  );
}
