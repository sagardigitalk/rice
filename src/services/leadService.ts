import apiClient from './apiClient';
import endPointApi from '../config/endpoints';

export interface Lead {
  _id?: string;
  contactPerson: string;
  companyName: string;
  status: string;
  email: string;
  phone?: string;
  assignedTo?: string;
}

export const leadService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    let url = endPointApi.leads;
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.search) queryParams.append('search', params.search);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await apiClient.get(url) as any;
    return response;
  },
  getById: async (id: string) => {
    return await apiClient.get(`${endPointApi.leads}/${id}`);
  },
  create: async (data: Lead) => {
    return await apiClient.post(endPointApi.leadCreate, data);
  },
  update: async (id: string, data: Partial<Lead>) => {
    return await apiClient.put(`${endPointApi.leadUpdate}/${id}`, data);
  },
  delete: async (id: string) => {
    return await apiClient.delete(`${endPointApi.leadDelete}/${id}`);
  },
};
