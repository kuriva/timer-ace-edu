import { useState } from 'react';
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

  const handleAdd = (examData: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => {
    onAddExam(examData);
    setShowAddForm(false);
  };

  const handleUpdate = (id: string, examData: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => {
    onUpdateExam(id, examData);
    setEditingExamId(null);
  };

  const editingExam = editingExamId ? exams.find(e => e.id === editingExamId) : null;

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto px-4">
      {exams.map((exam) => (
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
