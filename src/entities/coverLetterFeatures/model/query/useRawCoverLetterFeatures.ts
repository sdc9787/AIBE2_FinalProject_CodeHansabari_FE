import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchRawCoverLetterFeatures } from '@/entities/coverLetterFeatures/api';
import type { RawCoverLetterFeaturePage, ApiRawPageResponse } from '../type';

export const useRawCoverLetterFeatures = (
  page = 0,
  size = 20,
  sort?: string,
) => {
  return useQuery<ApiRawPageResponse, unknown, RawCoverLetterFeaturePage>({
    queryKey: coverLetterFeaturesQueryKeys.rawList(page, size, sort),
    queryFn: () => fetchRawCoverLetterFeatures(page, size, sort),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    select: (res: ApiRawPageResponse) => res.data,
    retry: 0,
  });
};
