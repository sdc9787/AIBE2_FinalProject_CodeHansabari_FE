import { useQuery } from '@tanstack/react-query';
import { coverLetterQueryKeys } from './queryKey';
import {
  CoverLetterListData,
  CoverLetterListResponse,
  fetchCoverLetterList,
} from '@/entities';

export const useCoverLetterList = () => {
  return useQuery<CoverLetterListResponse, Error, CoverLetterListData>({
    queryKey: coverLetterQueryKeys.list,
    queryFn: () => fetchCoverLetterList(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });
};
