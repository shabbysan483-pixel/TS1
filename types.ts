
export interface ContentBlock {
  type: 'text' | 'definition' | 'theorem' | 'example' | 'step' | 'image';
  title?: string;
  content: string; // Can contain LaTeX wrapped in $ or $$
  proof?: string; // Optional proof content
  imageUrl?: string;
  visualType?: 'cubic-summary' | 'rational-linear-summary' | 'rational-quadratic-summary' | 'oxyz-axes' | 'vector-cross' | 'vector-operations' | 'barycentric-visual' | 'csc-csn-comparison' | 'logarithm-sheet' | 'derivative-sheet' | 'integral-sheet' | 'integral-applications' | 'limit-sheet' | 'statistics-ungrouped' | 'statistics-grouped' | 'combinatorics-sheet';
}

export interface Section {
  title: string;
  blocks: ContentBlock[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  sections: Section[];
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  chapters: Chapter[];
}

// --- APP STATE TYPES ---
export type EducationLevel = '10' | '11' | '12' | 'formula' | 'exam-matrix';

// --- EXAM SYSTEM TYPES ---

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface BaseQuestion {
  id: string;
  lessonId: string; // To filter by topic
  content: string; // LaTeX supported
  explanation: string; // Detailed solution
  level: 'recognition' | 'understanding' | 'application'; // Needed for 73/27 split
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[]; // 4 options
  correctAnswer: number; // Index 0-3
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  // A True/False question has 4 sub-statements
  statements: {
    id: string;
    content: string;
    isCorrect: boolean;
  }[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer';
  correctAnswer: string | number; // Exact match or numeric tolerance
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export interface ExamConfig {
  lessonIds: string[];
  duration?: number; // Minutes
}

export interface UserAnswer {
  questionId: string;
  // For MC: index number. For TF: boolean[]. For Short: string
  answer: any; 
  isChecked: boolean; // Has the user asked to check this specific question?
}

// --- HISTORY TYPES ---
export interface ExamHistoryItem {
  id: string;
  date: string; // ISO string
  mode: 'exam' | 'review';
  score: number;
  maxScore: number;
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  duration: number; // seconds spent
  feedback?: string | null;
}

export interface ExamState {
  isRunning: boolean;
  isPaused: boolean;
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  timeLeft: number;
  phase: 'setup' | 'generating' | 'taking' | 'result';
  mode: 'exam' | 'review';
  setupData?: {
    topic: string;
    count: number;
  };
}