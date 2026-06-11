import apiClient from './apiClient';
import endPointApi from '@/config/endpoints';

export interface LoginResponse {
  success: boolean;
  token: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface MeResponse {
  success: boolean;
  data: User;
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    const response = await apiClient.post(endPointApi.authLogin, credentials);
    return response as unknown as LoginResponse; // apiClient returns response.data
  },
  
  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get(endPointApi.authMe);
    return response as unknown as MeResponse;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};
