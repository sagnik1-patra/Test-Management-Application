export interface Test {
  id: string;
  name: string; // From prompt: Test name
  title?: string; // Staging backend might use title
  subject: string;
  topics: string[]; // From prompt: Topics
  duration: number; // Duration in minutes
  markingScheme: {
    correct: number;
    incorrect: number;
  };
  totalMarks: number;
  instructions: string;
  status: 'draft' | 'published';
  createdAt: string;
  questionsCount?: number;
}

export interface TestFormData {
  name: string;
  subject: string;
  topics: string; // Comma separated in input form
  duration: number;
  correctMarks: number;
  incorrectMarks: number;
  totalMarks: number;
  instructions: string;
}
