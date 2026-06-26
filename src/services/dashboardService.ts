import apiClient from './apiClient';
import endPointApi from '@/config/endpoints';

export interface DashboardStats {
  totalLeads: number;
  activeFreight: number;
  exMillEntries: number;
  monthlyRevenue: number;
  chartData: Array<{
    name: string;
    leads: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    date: string;
    status: string;
  }>;
}

export const dashboardService = {
  getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    return await apiClient.get(endPointApi.dashboardStats);
  },
};
