import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamCard } from '@/components/ExamCard';
import { ExamForm } from '@/components/ExamForm';
import { ExamState, Exam } from '@/types/exam';

interface ExamListProps {
  exams: ExamState[];
  isAnyRunning: boolean;
  onAddExam: (exam: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => void;
  onUpdateExam: (id: string, updates: Partial<Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>>) => void;
  onRemoveExam: (id: string) => void;
}

export function ExamList({ exams, isAnyRunning, onAddExam, onUpdateExam, onRemoveExam }: ExamListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  const sortedExams = useMemo(() => {
    if (!isAnyRunning) return exams;

    return [...exams].sort((a, b) => {
      // First, sort by phase priority (perusal/planning before working/warning)
      const phaseOrder = { perusal: 0, planning: 1, working: 2, warning: 3, finished: 4, idle: 5 };
      const aPhaseOrder = phaseOrder[a.currentPhase];
      const bPhaseOrder = phaseOrder[b.currentPhase];

      // If one is in perusal/planning and other is not, perusal/planning comes first
      const aInPrePhase = a.currentPhase === 'perusal' || a.currentPhase === 'planning';
      const bInPrePhase = b.currentPhase === 'perusal' || b.currentPhase === 'planning';

      if (aInPrePhase && !bInPrePhase) return -1;
      if (!aInPrePhase && bInPrePhase) return 1;

      // If both in perusal/planning, sort by which finishes first
      if (aInPrePhase && bInPrePhase) {
        const aRemaining = a.currentPhase === 'perusal' ? a.perusalRemaining : a.planningRemaining;
        const bRemaining = b.currentPhase === 'perusal' ? b.perusalRemaining : b.planningRemaining;
        return aRemaining - bRemaining;
      }

      // If both in working/warning phase, sort by finish time
      if ((a.currentPhase === 'working' || a.currentPhase === 'warning') &&
          (b.currentPhase === 'working' || b.currentPhase === 'warning')) {
        return a.workingRemaining - b.workingRemaining;
      }

      // Default to phase order
      return aPhaseOrder - bPhaseOrder;
    });
  }, [exams, isAnyRunning]);

  const handleAdd = (examData: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => {
    onAddExam(examData);
    setShowAddForm(false);
  };

  const handleUpdate = (id: string, examData: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => {
    onUpdateExam(id, examData);
    setEditingExamId(null);
  };

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto px-4">
      {sortedExams.map((exam) => (
        editingExamId === exam.id ? (
          <ExamForm
            key={exam.id}
            exam={exam}
            onSubmit={(data) => handleUpdate(exam.id, data)}
            onCancel={() => setEditingExamId(null)}
            isEdit
          />
        ) : (
          <ExamCard
            key={exam.id}
            exam={exam}
            onEdit={() => setEditingExamId(exam.id)}
            onRemove={() => onRemoveExam(exam.id)}
            isRunning={isAnyRunning}
          />
        )
      ))}

      {showAddForm ? (
        <ExamForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      ) : !isAnyRunning && (
        <Button
          variant="outline"
          className="w-full py-8 border-dashed"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Exam
        </Button>
      )}
    </div>
  );
}
