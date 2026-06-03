import axiosInstance from './axiosInstance';

export const questionApi = {
  getQuestions: async (testId: string) => {
    // Attempt standard nested endpoint, fallback to query parameter if needed
    try {
      const response = await axiosInstance.get(`/tests/${testId}/questions`);
      return response.data;
    } catch (e) {
      console.warn('Nested questions endpoint failed, trying query parameter...', e);
      const response = await axiosInstance.get(`/questions?testId=${testId}`);
      return response.data;
    }
  },

  createQuestion: async (testId: string, data: any) => {
    try {
      const response = await axiosInstance.post(`/tests/${testId}/questions`, data);
      return response.data;
    } catch (e) {
      console.warn('Nested question creation failed, trying POST to /questions with testId in body...', e);
      const response = await axiosInstance.post('/questions', { ...data, testId });
      return response.data;
    }
  },

  updateQuestion: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: string) => {
    const response = await axiosInstance.delete(`/questions/${id}`);
    return response.data;
  }
};
