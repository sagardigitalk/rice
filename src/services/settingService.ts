import apiClient from './apiClient';
import endPointApi from '../config/endpoints';

export interface Setting {
  _id?: string;
  key: string;
  value: string;
}

export const settingService = {
  getByKey: async (key: string) => {
    return await apiClient.get(`${endPointApi.settings}/${key}`);
  },
  update: async (key: string, value: string) => {
    return await apiClient.put(`${endPointApi.settings}/${key}`, { value });
  },
};
