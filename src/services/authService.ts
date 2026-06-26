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
  login: async (credentials: Record<string, unknown>): Promise<LoginResponse> => {
    const response = await apiClient.post(endPointApi.authLogin, credentials);
    return response as unknown as LoginResponse; // apiClient returns response.data
  },
  
  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get(endPointApi.authMe);
    return response as unknown as MeResponse;
  },

  forgotPassword: async (email: string) => {
    return await apiClient.post(endPointApi.authForgotPassword, { email });
  },

  resetPassword: async (token: string, password: string) => {
    return await apiClient.put(`${endPointApi.authResetPassword}/${token}`, { password });
  },

  updateDetails: async (data: { name?: string; email?: string }) => {
    return await apiClient.put(endPointApi.authUpdateDetails, data);
  },

  updatePassword: async (data: Record<string, string>) => {
    return await apiClient.put(endPointApi.authUpdatePassword, data);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};
