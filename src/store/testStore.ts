import { create } from 'zustand';
import type { Test, TestFormData } from '../types/test.types';
import type { Question, QuestionFormData } from '../types/question.types';
import { testApi } from '../api/testApi';
import { questionApi } from '../api/questionApi';
import { useAuthStore } from './authStore';

interface TestActions {
  fetchTests: () => Promise<void>;
  fetchTestById: (id: string) => Promise<Test | null>;
  createTest: (data: TestFormData) => Promise<Test | null>;
  updateTest: (id: string, data: TestFormData) => Promise<boolean>;
  deleteTest: (id: string) => Promise<boolean>;
  publishTest: (id: string) => Promise<boolean>;
  
  fetchQuestions: (testId: string) => Promise<void>;
  createQuestion: (testId: string, data: QuestionFormData) => Promise<boolean>;
  updateQuestion: (id: string, data: QuestionFormData) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;

  setCurrentTest: (test: Test | null) => void;
  clearError: () => void;
}

interface TestState {
  tests: Test[];
  currentTest: Test | null;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY_TESTS = 'preproute_mock_tests';
const STORAGE_KEY_QUESTIONS = 'preproute_mock_questions';

// Pre-seeded mock tests
const SEED_TESTS: Test[] = [
  {
    id: 'test-1',
    name: 'CUET Quant & Logic Mastery',
    subject: 'Mathematics',
    topics: ['Arithmetic', 'Algebra', 'Number Systems', 'Logical Reasoning'],
    duration: 60,
    markingScheme: { correct: 5, incorrect: -1 },
    totalMarks: 100,
    instructions: '1. All questions are compulsory.\n2. Each correct answer carries 5 marks.\n3. Each wrong answer incurs a 1 mark penalty.',
    status: 'published',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'test-2',
    name: 'Physics: Mechanics & Waves',
    subject: 'Physics',
    topics: ['Kinematics', 'Newton Laws', 'Simple Harmonic Motion', 'Waves'],
    duration: 45,
    markingScheme: { correct: 4, incorrect: 0 },
    totalMarks: 80,
    instructions: '1. Use of calculator is permitted for constants.\n2. No negative marking in this test.',
    status: 'draft',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Pre-seeded mock questions
const SEED_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    testId: 'test-1',
    questionText: 'What is the value of x if 3x + 7 = 22?',
    options: ['3', '5', '7', '9'],
    correctAnswer: 1, // index 1 is "5"
    marks: 5,
    negativeMarks: 1,
  },
  {
    id: 'q-2',
    testId: 'test-1',
    questionText: 'If a train runs at 60 km/h, how much distance does it cover in 15 minutes?',
    options: ['10 km', '12 km', '15 km', '20 km'],
    correctAnswer: 2, // index 2 is "15 km"
    marks: 5,
    negativeMarks: 1,
  },
  {
    id: 'q-3',
    testId: 'test-2',
    questionText: 'Which of the following is the unit of force?',
    options: ['Watt', 'Joule', 'Newton', 'Pascal'],
    correctAnswer: 2, // index 2 is "Newton"
    marks: 4,
    negativeMarks: 0,
  }
];

// Helper to check mock storage
const getMockTests = (): Test[] => {
  const data = localStorage.getItem(STORAGE_KEY_TESTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(SEED_TESTS));
    return SEED_TESTS;
  }
  return JSON.parse(data);
};

const getMockQuestions = (): Question[] => {
  const data = localStorage.getItem(STORAGE_KEY_QUESTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(SEED_QUESTIONS));
    return SEED_QUESTIONS;
  }
  return JSON.parse(data);
};

const saveMockTests = (tests: Test[]) => {
  localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(tests));
};

const saveMockQuestions = (questions: Question[]) => {
  localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
};

export const useTestStore = create<TestState & TestActions>((set, get) => ({
  tests: [],
  currentTest: null,
  questions: [],
  isLoading: false,
  error: null,

  setCurrentTest: (test) => set({ currentTest: test }),
  clearError: () => set({ error: null }),

  fetchTests: async () => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    if (isMock) {
      setTimeout(() => {
        set({ tests: getMockTests(), isLoading: false });
      }, 300);
      return;
    }

    try {
      const response = await testApi.getAllTests();
      // Adjust format if backend wraps test in data property
      const fetchedTests = Array.isArray(response) ? response : (response.data || []);
      
      // Ensure the naming "name" is mapped correctly if the backend uses "title"
      const mappedTests = fetchedTests.map((t: any) => ({
        id: t._id || t.id,
        name: t.name || t.title || 'Untitled Test',
        subject: t.subject || '',
        topics: Array.isArray(t.topics) ? t.topics : (typeof t.topics === 'string' ? t.topics.split(',').map((s: string) => s.trim()) : []),
        duration: Number(t.duration) || 0,
        markingScheme: t.markingScheme || { correct: 4, incorrect: 0 },
        totalMarks: Number(t.totalMarks) || 0,
        instructions: t.instructions || '',
        status: t.status || 'draft',
        createdAt: t.createdAt || new Date().toISOString(),
      }));

      set({ tests: mappedTests, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch tests from API, reading from mock.', err);
      // fallback
      set({ 
        tests: getMockTests(), 
        isLoading: false,
        error: 'Showing offline mock data. API returned error: ' + (err.message || 'Server error')
      });
    }
  },

  fetchTestById: async (id) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    if (isMock) {
      const tests = getMockTests();
      const test = tests.find(t => t.id === id) || null;
      set({ currentTest: test, isLoading: false });
      return test;
    }

    try {
      const data = await testApi.getTestById(id);
      const t = data.data || data;
      const mappedTest: Test = {
        id: t._id || t.id,
        name: t.name || t.title || 'Untitled Test',
        subject: t.subject || '',
        topics: Array.isArray(t.topics) ? t.topics : (typeof t.topics === 'string' ? t.topics.split(',').map((s: string) => s.trim()) : []),
        duration: Number(t.duration) || 0,
        markingScheme: t.markingScheme || { correct: 4, incorrect: 0 },
        totalMarks: Number(t.totalMarks) || 0,
        instructions: t.instructions || '',
        status: t.status || 'draft',
        createdAt: t.createdAt || new Date().toISOString(),
      };
      set({ currentTest: mappedTest, isLoading: false });
      return mappedTest;
    } catch (err: any) {
      console.warn('Failed to fetch test details from API. Falling back to local storage.', err);
      const tests = getMockTests();
      const test = tests.find(t => t.id === id) || null;
      set({ 
        currentTest: test, 
        isLoading: false,
        error: 'Showing offline mock details. API error: ' + (err.message || 'Server error')
      });
      return test;
    }
  },

  createTest: async (data) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    const topicsArray = data.topics.split(',').map(s => s.trim()).filter(Boolean);

    if (isMock) {
      const newTest: Test = {
        id: 'test-' + Date.now(),
        name: data.name,
        subject: data.subject,
        topics: topicsArray,
        duration: Number(data.duration),
        markingScheme: {
          correct: Number(data.correctMarks),
          incorrect: Number(data.incorrectMarks)
        },
        totalMarks: Number(data.totalMarks),
        instructions: data.instructions,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      const tests = getMockTests();
      tests.unshift(newTest);
      saveMockTests(tests);
      
      set({ tests, currentTest: newTest, isLoading: false });
      return newTest;
    }

    try {
      const apiPayload = {
        title: data.name, // staging backend compatibility
        name: data.name,
        subject: data.subject,
        topics: topicsArray,
        duration: Number(data.duration),
        markingScheme: {
          correct: Number(data.correctMarks),
          incorrect: Number(data.incorrectMarks)
        },
        totalMarks: Number(data.totalMarks),
        instructions: data.instructions
      };

      const response = await testApi.createTest(apiPayload);
      const t = response.data || response;
      const createdTest: Test = {
        id: t._id || t.id,
        name: t.name || t.title || data.name,
        subject: t.subject || data.subject,
        topics: t.topics || topicsArray,
        duration: Number(t.duration) || data.duration,
        markingScheme: t.markingScheme || { correct: data.correctMarks, incorrect: data.incorrectMarks },
        totalMarks: Number(t.totalMarks) || data.totalMarks,
        instructions: t.instructions || data.instructions,
        status: t.status || 'draft',
        createdAt: t.createdAt || new Date().toISOString()
      };

      set(state => ({
        tests: [createdTest, ...state.tests],
        currentTest: createdTest,
        isLoading: false
      }));
      return createdTest;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to create test' });
      return null;
    }
  },

  updateTest: async (id, data) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;
    const topicsArray = data.topics.split(',').map(s => s.trim()).filter(Boolean);

    if (isMock) {
      const tests = getMockTests();
      const idx = tests.findIndex(t => t.id === id);
      if (idx !== -1) {
        tests[idx] = {
          ...tests[idx],
          name: data.name,
          subject: data.subject,
          topics: topicsArray,
          duration: Number(data.duration),
          markingScheme: {
            correct: Number(data.correctMarks),
            incorrect: Number(data.incorrectMarks)
          },
          totalMarks: Number(data.totalMarks),
          instructions: data.instructions
        };
        saveMockTests(tests);
        set({ tests, currentTest: tests[idx], isLoading: false });
        return true;
      }
      set({ isLoading: false, error: 'Test not found in mock store' });
      return false;
    }

    try {
      const apiPayload = {
        title: data.name,
        name: data.name,
        subject: data.subject,
        topics: topicsArray,
        duration: Number(data.duration),
        markingScheme: {
          correct: Number(data.correctMarks),
          incorrect: Number(data.incorrectMarks)
        },
        totalMarks: Number(data.totalMarks),
        instructions: data.instructions
      };

      await testApi.updateTest(id, apiPayload);
      
      // Refresh current test from backend or local update
      set(state => {
        const updatedTests = state.tests.map(t => {
          if (t.id === id) {
            return {
              ...t,
              name: data.name,
              subject: data.subject,
              topics: topicsArray,
              duration: Number(data.duration),
              markingScheme: {
                correct: Number(data.correctMarks),
                incorrect: Number(data.incorrectMarks)
              },
              totalMarks: Number(data.totalMarks),
              instructions: data.instructions
            };
          }
          return t;
        });
        const current = updatedTests.find(t => t.id === id) || null;
        return { tests: updatedTests, currentTest: current, isLoading: false };
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to update test' });
      return false;
    }
  },

  deleteTest: async (id) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    if (isMock) {
      const tests = getMockTests().filter(t => t.id !== id);
      saveMockTests(tests);
      
      // Also delete associated questions
      const questions = getMockQuestions().filter(q => q.testId !== id);
      saveMockQuestions(questions);

      set({ tests, currentTest: null, isLoading: false });
      return true;
    }

    try {
      await testApi.deleteTest(id);
      set(state => ({
        tests: state.tests.filter(t => t.id !== id),
        currentTest: state.currentTest?.id === id ? null : state.currentTest,
        isLoading: false
      }));
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to delete test' });
      return false;
    }
  },

  publishTest: async (id) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    if (isMock) {
      const tests = getMockTests();
      const idx = tests.findIndex(t => t.id === id);
      if (idx !== -1) {
        tests[idx].status = 'published';
        saveMockTests(tests);
        set({ tests, currentTest: tests[idx], isLoading: false });
        return true;
      }
      set({ isLoading: false, error: 'Test not found' });
      return false;
    }

    try {
      await testApi.publishTest(id);
      set(state => {
        const updatedTests = state.tests.map(t => {
          if (t.id === id) {
            return { ...t, status: 'published' as const };
          }
          return t;
        });
        const current = updatedTests.find(t => t.id === id) || null;
        return { tests: updatedTests, currentTest: current, isLoading: false };
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to publish test' });
      return false;
    }
  },

  fetchQuestions: async (testId) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    if (isMock) {
      const qs = getMockQuestions().filter(q => q.testId === testId);
      set({ questions: qs, isLoading: false });
      return;
    }

    try {
      const response = await questionApi.getQuestions(testId);
      const fetched = Array.isArray(response) ? response : (response.data || []);
      
      const mapped = fetched.map((q: any) => ({
        id: q._id || q.id,
        testId: q.testId || testId,
        questionText: q.questionText || q.question || '',
        options: Array.isArray(q.options) ? q.options : [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
        correctAnswer: q.correctAnswer !== undefined ? Number(q.correctAnswer) : 0,
        marks: Number(q.marks) || 4,
        negativeMarks: Number(q.negativeMarks) || 0,
      }));

      set({ questions: mapped, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch questions from API. Reading from local mock.', err);
      const qs = getMockQuestions().filter(q => q.testId === testId);
      set({ 
        questions: qs, 
        isLoading: false, 
        error: 'Showing offline questions. API error: ' + (err.message || 'Server error')
      });
    }
  },

  createQuestion: async (testId, data) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;
    const options = [data.option1, data.option2, data.option3, data.option4];

    if (isMock) {
      const newQuestion: Question = {
        id: 'q-' + Date.now(),
        testId,
        questionText: data.questionText,
        options,
        correctAnswer: Number(data.correctAnswer),
        marks: Number(data.marks),
        negativeMarks: Number(data.negativeMarks)
      };

      const qs = getMockQuestions();
      qs.push(newQuestion);
      saveMockQuestions(qs);

      set(state => ({
        questions: [...state.questions, newQuestion],
        isLoading: false
      }));
      return true;
    }

    try {
      const apiPayload = {
        questionText: data.questionText,
        options,
        correctAnswer: Number(data.correctAnswer),
        marks: Number(data.marks),
        negativeMarks: Number(data.negativeMarks)
      };
      await questionApi.createQuestion(testId, apiPayload);
      
      // Re-fetch questions to keep state fully in-sync
      await get().fetchQuestions(testId);
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to add question' });
      return false;
    }
  },

  updateQuestion: async (id, data) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;
    const options = [data.option1, data.option2, data.option3, data.option4];

    if (isMock) {
      const qs = getMockQuestions();
      const idx = qs.findIndex(q => q.id === id);
      if (idx !== -1) {
        qs[idx] = {
          ...qs[idx],
          questionText: data.questionText,
          options,
          correctAnswer: Number(data.correctAnswer),
          marks: Number(data.marks),
          negativeMarks: Number(data.negativeMarks)
        };
        saveMockQuestions(qs);
        
        // Update local state
        set(state => ({
          questions: state.questions.map(q => q.id === id ? qs[idx] : q),
          isLoading: false
        }));
        return true;
      }
      set({ isLoading: false, error: 'Question not found' });
      return false;
    }

    try {
      const apiPayload = {
        questionText: data.questionText,
        options,
        correctAnswer: Number(data.correctAnswer),
        marks: Number(data.marks),
        negativeMarks: Number(data.negativeMarks)
      };
      await questionApi.updateQuestion(id, apiPayload);
      if (get().currentTest) {
        await get().fetchQuestions(get().currentTest!.id);
      }
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to update question' });
      return false;
    }
  },

  deleteQuestion: async (id) => {
    set({ isLoading: true, error: null });
    const isMock = useAuthStore.getState().isMockMode;

    if (isMock) {
      const qs = getMockQuestions().filter(q => q.id !== id);
      saveMockQuestions(qs);
      
      set(state => ({
        questions: state.questions.filter(q => q.id !== id),
        isLoading: false
      }));
      return true;
    }

    try {
      await questionApi.deleteQuestion(id);
      set(state => ({
        questions: state.questions.filter(q => q.id !== id),
        isLoading: false
      }));
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || err.message || 'Failed to delete question' });
      return false;
    }
  }
}));
