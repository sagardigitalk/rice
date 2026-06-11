import apiClient from './apiClient';
import endPointApi from '../config/endpoints';

export interface Freight {
  _id?: string;
  country: string;
  portName: string;
  seaFreightUsd: number;
  cocUsd: number;
  createdAt?: string;
  updatedAt?: string;
}

export const freightService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    let url = endPointApi.freight;
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
    return await apiClient.get(`${endPointApi.freight}/${id}`);
  },
  create: async (data: Freight) => {
    return await apiClient.post(endPointApi.freightCreate, data);
  },
  update: async (id: string, data: Partial<Freight>) => {
    return await apiClient.put(`${endPointApi.freightUpdate}/${id}`, data);
  },
  delete: async (id: string) => {
    return await apiClient.delete(`${endPointApi.freightDelete}/${id}`);
  },
};
