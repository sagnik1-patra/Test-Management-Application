export interface User {
  id: string;
  userId: string;
  name: string;
  role: 'admin' | 'moderator';
  email?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;
}

export interface LoginResponse {
  status: string;
  message?: string;
  token?: string; // fallback if direct
  user?: User;    // fallback if direct
  data?: {
    token: string;
    user: User;
  };
}
