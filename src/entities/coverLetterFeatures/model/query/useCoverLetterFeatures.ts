import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchCoverLetterFeatures } from '@/entities/coverLetterFeatures/api';
import type { CoverLetterFeaturePage, ApiFeaturePageResponse } from '../type';

export const useCoverLetterFeatures = (page = 0, size = 20, sort?: string) => {
  return useQuery<ApiFeaturePageResponse, unknown, CoverLetterFeaturePage>({
    queryKey: coverLetterFeaturesQueryKeys.list(page, size, sort),
    queryFn: () => fetchCoverLetterFeatures(page, size, sort),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    select: (res: ApiFeaturePageResponse) => res.data,
  });
};
