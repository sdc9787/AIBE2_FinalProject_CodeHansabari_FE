import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import {
  AdminCoverLetterListResponse,
  FetchAdminCoverLettersParams,
} from '../type';
import { fetchAdminCoverLetters } from '@/entities/admin/api/fetchAdminCoverLetter';

export const useAdminCoverLetters = (params: FetchAdminCoverLettersParams) => {
  const { page, size } = params;
  return useQuery<
    AdminCoverLetterListResponse,
    Error,
    AdminCoverLetterListResponse['data']
  >({
    queryKey: adminQueryKeys.coverLetters(page, size),
    queryFn: () => fetchAdminCoverLetters(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};
