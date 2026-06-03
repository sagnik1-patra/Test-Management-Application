import { z } from 'zod';

// Login Validation Schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Test Form Validation Schema
export const testSchema = z.object({
  name: z.string().min(3, 'Test name must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.string().min(1, 'At least one topic is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  correctMarks: z.number().min(1, 'Correct answer marks must be at least 1'),
  incorrectMarks: z.number().max(0, 'Incorrect answer marks must be negative or zero (e.g. -1 or 0)'),
  totalMarks: z.number().min(1, 'Total marks must be greater than 0'),
  instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
});

// MCQ Question Validation Schema
export const questionSchema = z.object({
  questionText: z.string().min(5, 'Question text must be at least 5 characters'),
  option1: z.string().min(1, 'Option 1 is required'),
  option2: z.string().min(1, 'Option 2 is required'),
  option3: z.string().min(1, 'Option 3 is required'),
  option4: z.string().min(1, 'Option 4 is required'),
  correctAnswer: z.number().min(0).max(3),
  marks: z.number().min(1, 'Marks must be at least 1'),
  negativeMarks: z.number().min(0, 'Negative marks must be 0 or greater'),
});

export type TestSchemaType = z.infer<typeof testSchema>;
export type QuestionSchemaType = z.infer<typeof questionSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
