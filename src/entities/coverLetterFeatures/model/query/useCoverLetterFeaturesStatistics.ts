import { useQuery } from '@tanstack/react-query';
import { coverLetterFeaturesQueryKeys } from './queryKey';
import { fetchCoverLetterFeaturesStatistics } from '@/entities/coverLetterFeatures/api';

export const useCoverLetterFeaturesStatistics = () => {
  return useQuery({
    queryKey: coverLetterFeaturesQueryKeys.statistics,
    queryFn: () => fetchCoverLetterFeaturesStatistics(),
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    select: (res: any) => res.data,
  });
};
