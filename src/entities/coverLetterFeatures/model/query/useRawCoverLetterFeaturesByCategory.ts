import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchRawCoverLetterFeaturesByCategory } from '@/entities/coverLetterFeatures/api';
import type {
  RawCoverLetterFeaturePage,
  ApiRawByCategoryResponse,
} from '../type';

export const useRawCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) => {
  return useQuery<ApiRawByCategoryResponse, unknown, RawCoverLetterFeaturePage>(
    {
      queryKey: coverLetterFeaturesQueryKeys.rawCategory(
        category,
        page,
        size,
        sort,
      ),
      queryFn: () =>
        fetchRawCoverLetterFeaturesByCategory(category, page, size, sort),
      // only run when a category is selected
      enabled: !!category,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      select: (res: ApiRawByCategoryResponse) => res.data,
    },
  );
};
