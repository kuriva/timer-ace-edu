export interface Exam {
  id: string;
  year: number;
  testDetails: string;
  examLengthMinutes: number; // 60-120 in 5 min increments
  perusalMinutes: number; // 0, 5, 10, 15, 20
  planningMinutes: number; // 0, 5, 10, 15, 20
  isRunning: boolean;
  startTime: Date | null;
  finishTime: Date | null;
}

export type ExamPhase = 'idle' | 'perusal' | 'planning' | 'working' | 'warning' | 'finished';

export interface ExamState extends Exam {
  currentPhase: ExamPhase;
  perusalRemaining: number; // seconds
  planningRemaining: number; // seconds
  workingRemaining: number; // seconds
}
