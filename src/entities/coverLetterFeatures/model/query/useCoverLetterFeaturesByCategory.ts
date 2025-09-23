import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchCoverLetterFeaturesByCategory } from '@/entities/coverLetterFeatures/api';

export const useCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) => {
  return useQuery({
    queryKey: coverLetterFeaturesQueryKeys.category(category, page, size, sort),
    queryFn: () =>
      fetchCoverLetterFeaturesByCategory(category, page, size, sort),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    select: (res: any) => res.data,
  });
};
