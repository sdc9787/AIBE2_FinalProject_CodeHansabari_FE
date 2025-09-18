import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import { fetchAdminMemberStatistics } from '../../api';
import { AdminMemberStatisticsResponse } from '../type';

export const useAdminMemberStatistics = () => {
  return useQuery<
    AdminMemberStatisticsResponse,
    Error,
    AdminMemberStatisticsResponse['data']
  >({
    queryKey: adminQueryKeys.memberStatistics(),
    queryFn: fetchAdminMemberStatistics,
    staleTime: 1000 * 60 * 10, // 10분
    select: (data) => data.data,
  });
};
