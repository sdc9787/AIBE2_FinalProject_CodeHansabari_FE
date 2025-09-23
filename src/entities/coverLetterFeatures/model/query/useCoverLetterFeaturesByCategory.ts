import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchCoverLetterFeaturesByCategory } from '@/entities/coverLetterFeatures/api';
import type { CoverLetterFeaturePage, ApiFeaturePageResponse } from '../type';

export const useCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) => {
  return useQuery<ApiFeaturePageResponse, unknown, CoverLetterFeaturePage>({
    queryKey: coverLetterFeaturesQueryKeys.category(category, page, size, sort),
    queryFn: () =>
      fetchCoverLetterFeaturesByCategory(category, page, size, sort),
    // only run when a category is selected
    enabled: !!category,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    select: (res: ApiFeaturePageResponse) => res.data,
  });
};
