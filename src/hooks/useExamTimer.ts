import { useState, useEffect, useCallback, useRef } from 'react';
import { Exam, ExamState, ExamPhase } from '@/types/exam';

interface UseExamTimerReturn {
  exams: ExamState[];
  currentTime: Date;
  isAnyRunning: boolean;
  addExam: (exam: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => void;
  updateExam: (id: string, updates: Partial<Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>>) => void;
  removeExam: (id: string) => void;
  startAllExams: () => void;
  resetAllExams: () => void;
}

export function useExamTimer(): UseExamTimerReturn {
  const [exams, setExams] = useState<ExamState[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAnyRunning = exams.some(e => e.isRunning);

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isAnyRunning) {
      intervalRef.current = setInterval(() => {
        setExams(prevExams => 
          prevExams.map(exam => {
            if (!exam.isRunning || exam.currentPhase === 'finished') return exam;

            let newExam = { ...exam };

            if (exam.currentPhase === 'perusal' && exam.perusalRemaining > 0) {
              newExam.perusalRemaining = exam.perusalRemaining - 1;
              if (newExam.perusalRemaining <= 0) {
                if (exam.planningMinutes > 0) {
                  newExam.currentPhase = 'planning';
                } else {
                  newExam.currentPhase = 'working';
                }
              }
            } else if (exam.currentPhase === 'planning' && exam.planningRemaining > 0) {
              newExam.planningRemaining = exam.planningRemaining - 1;
              if (newExam.planningRemaining <= 0) {
                newExam.currentPhase = 'working';
              }
            } else if (exam.currentPhase === 'working' || exam.currentPhase === 'warning') {
              newExam.workingRemaining = exam.workingRemaining - 1;
              
              // Check for 10 minute warning
              if (newExam.workingRemaining <= 600 && newExam.workingRemaining > 0) {
                newExam.currentPhase = 'warning';
              }
              
              if (newExam.workingRemaining <= 0) {
                newExam.currentPhase = 'finished';
                newExam.isRunning = false;
              }
            }

            return newExam;
          })
        );
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnyRunning]);

  const addExam = useCallback((examData: Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>) => {
    const newExam: ExamState = {
      ...examData,
      id: crypto.randomUUID(),
      isRunning: false,
      startTime: null,
      finishTime: null,
      currentPhase: 'idle',
      perusalRemaining: examData.perusalMinutes * 60,
      planningRemaining: examData.planningMinutes * 60,
      workingRemaining: examData.examLengthMinutes * 60,
    };
    setExams(prev => [...prev, newExam]);
  }, []);

  const updateExam = useCallback((id: string, updates: Partial<Omit<Exam, 'id' | 'isRunning' | 'startTime' | 'finishTime'>>) => {
    setExams(prev => prev.map(exam => {
      if (exam.id !== id || exam.isRunning) return exam;
      
      const updated = { ...exam, ...updates };
      return {
        ...updated,
        perusalRemaining: (updates.perusalMinutes ?? exam.perusalMinutes) * 60,
        planningRemaining: (updates.planningMinutes ?? exam.planningMinutes) * 60,
        workingRemaining: (updates.examLengthMinutes ?? exam.examLengthMinutes) * 60,
      };
    }));
  }, []);

  const removeExam = useCallback((id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  }, []);

  const startAllExams = useCallback(() => {
    const now = new Date();
    setExams(prev => prev.map(exam => {
      if (exam.currentPhase !== 'idle') return exam;
      
      // Calculate total time for finish time
      const totalMinutes = exam.perusalMinutes + exam.planningMinutes + exam.examLengthMinutes;
      const finishTime = new Date(now.getTime() + totalMinutes * 60 * 1000);
      
      // Determine starting phase
      let startPhase: ExamPhase = 'working';
      if (exam.perusalMinutes > 0) {
        startPhase = 'perusal';
      } else if (exam.planningMinutes > 0) {
        startPhase = 'planning';
      }

      return {
        ...exam,
        isRunning: true,
        startTime: now,
        finishTime,
        currentPhase: startPhase,
      };
    }));
  }, []);

  const resetAllExams = useCallback(() => {
    setExams(prev => prev.map(exam => ({
      ...exam,
      isRunning: false,
      startTime: null,
      finishTime: null,
      currentPhase: 'idle' as ExamPhase,
      perusalRemaining: exam.perusalMinutes * 60,
      planningRemaining: exam.planningMinutes * 60,
      workingRemaining: exam.examLengthMinutes * 60,
    })));
  }, []);

  return {
    exams,
    currentTime,
    isAnyRunning,
    addExam,
    updateExam,
    removeExam,
    startAllExams,
    resetAllExams,
  };
}
