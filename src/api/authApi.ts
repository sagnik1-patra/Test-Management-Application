import axiosInstance from './axiosInstance';
import type { LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Map UI "username" to API's required "userId" parameter
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      userId: username,
      password: password
    });
    return response.data;
  }
};
