import { useQuery } from '@tanstack/react-query';
import { coverLetterQueryKeys } from './queryKey';
import {
  CoverLetterListData,
  CoverLetterListResponse,
  fetchCoverLetterList,
} from '@/entities';

export const useCoverLetterList = (
  page: number,
  view?: 'thumbnail' | 'all',
) => {
  return useQuery<CoverLetterListResponse, Error, CoverLetterListData>({
    queryKey: coverLetterQueryKeys.list(page),
    queryFn: () => fetchCoverLetterList(page, view || 'all'),
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });
};
