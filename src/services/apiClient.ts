import axios from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Optional: Attach token if we have one in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // Check if the backend sent a success message
    const successMessage = response.data?.message;
    if (successMessage && typeof window !== 'undefined') {
      // toast.success(successMessage);
    }
    return response.data;
  },
  (error) => {
    // Extract error message from backend response if available
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred';
    
    // Global error handling with toast
    if (typeof window !== 'undefined') {
      // toast.error(errorMessage);
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
