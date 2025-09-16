import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import { AdminResumeListResponse, FetchAdminResumesParams } from '../type';
import { fetchAdminResumes } from '@/entities/admin/api/fetchAdminResumes';

export const useAdminResumes = (params: FetchAdminResumesParams) => {
  const { page, size } = params;
  return useQuery<
    AdminResumeListResponse,
    Error,
    AdminResumeListResponse['data']
  >({
    queryKey: adminQueryKeys.resumes(page, size),
    queryFn: () => fetchAdminResumes(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};
