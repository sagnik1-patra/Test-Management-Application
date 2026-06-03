import axiosInstance from './axiosInstance';

export const testApi = {
  getAllTests: async () => {
    const response = await axiosInstance.get('/tests');
    return response.data;
  },

  getTestById: async (id: string) => {
    const response = await axiosInstance.get(`/tests/${id}`);
    return response.data;
  },

  createTest: async (data: any) => {
    const response = await axiosInstance.post('/tests', data);
    return response.data;
  },

  updateTest: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/tests/${id}`, data);
    return response.data;
  },

  deleteTest: async (id: string) => {
    const response = await axiosInstance.delete(`/tests/${id}`);
    return response.data;
  },

  publishTest: async (id: string) => {
    // Attempt standard publish endpoint. Fallback to PATCH status if needed.
    try {
      const response = await axiosInstance.post(`/tests/${id}/publish`);
      return response.data;
    } catch (e) {
      console.warn('Publish via POST failed, attempting PATCH status...', e);
      const response = await axiosInstance.patch(`/tests/${id}`, { status: 'published' });
      return response.data;
    }
  }
};
