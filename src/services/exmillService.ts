import apiClient from './apiClient';
import endPointApi from '../config/endpoints';

export interface ExMill {
  _id?: string;
  variety: string;
  form: string;
  inrPerKg: number;
  inrPerMt?: number;
  usdPerMt?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const exmillService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    let url = endPointApi.exmill;
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.search) queryParams.append('search', params.search);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await apiClient.get(url);
    return response;
  },
  getById: async (id: string) => {
    return await apiClient.get(`${endPointApi.exmill}/${id}`);
  },
  create: async (data: ExMill) => {
    return await apiClient.post(endPointApi.exmillCreate, data);
  },
  update: async (id: string, data: Partial<ExMill>) => {
    return await apiClient.put(`${endPointApi.exmillUpdate}/${id}`, data);
  },
  delete: async (id: string) => {
    return await apiClient.delete(`${endPointApi.exmillDelete}/${id}`);
  },
};
