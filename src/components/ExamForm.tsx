import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exam } from '@/types/exam';

interface ExamFormProps {
  exam?: Partial<Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>>;
  onSubmit: (exam: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const EXAM_LENGTH_OPTIONS = [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
const PERUSAL_PLANNING_OPTIONS = [0, 5, 10, 15, 20];

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours} hr ${mins} mins`;
}

export function ExamForm({ exam, onSubmit, onCancel, isEdit }: ExamFormProps) {
  const [year, setYear] = useState(exam?.year ?? 11);
  const [testDetails, setTestDetails] = useState(exam?.testDetails ?? '');
  const [examLengthMinutes, setExamLengthMinutes] = useState(exam?.examLengthMinutes ?? 60);
  const [perusalMinutes, setPerusalMinutes] = useState(exam?.perusalMinutes ?? 0);
  const [planningMinutes, setPlanningMinutes] = useState(exam?.planningMinutes ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testDetails.trim()) return;
    
    onSubmit({
      year,
      testDetails: testDetails.trim(),
      examLengthMinutes,
      perusalMinutes,
      planningMinutes,
    });
  };

  const adjustValue = (
    current: number, 
    delta: number, 
    options: number[], 
    setter: (val: number) => void
  ) => {
    const currentIndex = options.indexOf(current);
    const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + delta));
    setter(options[newIndex]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card border border-border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setYear(Math.max(7, year - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(Math.max(7, Math.min(12, parseInt(e.target.value) || 7)))}
              min={7}
              max={12}
              className="text-center font-mono text-lg"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setYear(Math.min(12, year + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testDetails">Test Details</Label>
          <Input
            id="testDetails"
            value={testDetails}
            onChange={(e) => setTestDetails(e.target.value)}
            placeholder="e.g., Physics - IA1"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Exam Length: {formatDuration(examLengthMinutes)}</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => adjustValue(examLengthMinutes, -1, EXAM_LENGTH_OPTIONS, setExamLengthMinutes)}
            disabled={examLengthMinutes <= 60}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${((examLengthMinutes - 60) / 60) * 100}%` }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => adjustValue(examLengthMinutes, 1, EXAM_LENGTH_OPTIONS, setExamLengthMinutes)}
            disabled={examLengthMinutes >= 120}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">1 hour to 2 hours (5 minute increments)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Perusal Time: {perusalMinutes === 0 ? 'None' : `${perusalMinutes} mins`}</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustValue(perusalMinutes, -1, PERUSAL_PLANNING_OPTIONS, setPerusalMinutes)}
              disabled={perusalMinutes <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-timer-safe transition-all"
                style={{ width: `${(perusalMinutes / 20) * 100}%` }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustValue(perusalMinutes, 1, PERUSAL_PLANNING_OPTIONS, setPerusalMinutes)}
              disabled={perusalMinutes >= 20}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Planning Time: {planningMinutes === 0 ? 'None' : `${planningMinutes} mins`}</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustValue(planningMinutes, -1, PERUSAL_PLANNING_OPTIONS, setPlanningMinutes)}
              disabled={planningMinutes <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-400 transition-all"
                style={{ width: `${(planningMinutes / 20) * 100}%` }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustValue(planningMinutes, 1, PERUSAL_PLANNING_OPTIONS, setPlanningMinutes)}
              disabled={planningMinutes >= 20}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Exam' : 'Add Exam'}
        </Button>
      </div>
    </form>
  );
}
