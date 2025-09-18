import { clientFetch } from '@/shared';
import { AdminMemberStatisticsResponse } from '../model';

export const fetchAdminMemberStatistics =
  async (): Promise<AdminMemberStatisticsResponse> => {
    return clientFetch.get('/api/v1/admin/statistics');
  };
