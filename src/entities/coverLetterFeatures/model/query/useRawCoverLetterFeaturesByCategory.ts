import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchRawCoverLetterFeaturesByCategory } from '@/entities/coverLetterFeatures/api';

export const useRawCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) => {
  return useQuery({
    queryKey: coverLetterFeaturesQueryKeys.rawCategory(
      category,
      page,
      size,
      sort,
    ),
    queryFn: () =>
      fetchRawCoverLetterFeaturesByCategory(category, page, size, sort),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    select: (res: any) => res.data,
  });
};
