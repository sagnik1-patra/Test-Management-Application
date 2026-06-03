export interface Question {
  id: string;
  testId: string;
  questionText: string;
  options: string[]; // Exactly 4 options
  correctAnswer: number; // 0, 1, 2, or 3 index of options
  marks: number;
  negativeMarks: number;
}

export interface QuestionFormData {
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number; // 0, 1, 2, or 3 index
  marks: number;
  negativeMarks: number;
}
