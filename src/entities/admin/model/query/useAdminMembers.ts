import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import type { AdminMemberListResponse, FetchAdminMembersParams } from '../type';
import { fetchAdminMembers } from '../../api';

export const useAdminMembers = (params: FetchAdminMembersParams) => {
  return useQuery<
    AdminMemberListResponse,
    Error,
    AdminMemberListResponse['data']
  >({
    queryKey: adminQueryKeys.members(params),
    queryFn: () => fetchAdminMembers(params),
    staleTime: 1000 * 60 * 5, // 5분
    select: (data) => data.data,
  });
};
