import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchCoverLetterFeatures } from '@/entities/coverLetterFeatures/api';

export const useCoverLetterFeatures = (page = 0, size = 20, sort?: string) => {
  return useQuery({
    queryKey: coverLetterFeaturesQueryKeys.list(page, size, sort),
    queryFn: () => fetchCoverLetterFeatures(page, size, sort),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    select: (res: any) => res.data,
  });
};
