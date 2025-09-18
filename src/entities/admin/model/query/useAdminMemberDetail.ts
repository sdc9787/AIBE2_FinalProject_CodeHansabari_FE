import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import { fetchAdminMemberDetail } from '../../api';
import { AdminMemberDetailResponse } from '../type';

export const useAdminMemberDetail = (memberId: number) => {
  return useQuery<
    AdminMemberDetailResponse,
    Error,
    AdminMemberDetailResponse['data']
  >({
    queryKey: adminQueryKeys.memberDetail(memberId),
    queryFn: () => fetchAdminMemberDetail(memberId),
    enabled: !!memberId,
    staleTime: 1000 * 60 * 5, // 5분
    select: (data) => data.data,
  });
};
