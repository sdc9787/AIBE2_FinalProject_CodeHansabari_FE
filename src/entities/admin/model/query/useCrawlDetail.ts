import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import { CrawlDetailResponse } from '../type';
import { fetchCrawlDetail } from '@/entities/admin/api/fetchCrawlDetail';

export const useCrawlDetail = (id: number) => {
  return useQuery<CrawlDetailResponse, Error, CrawlDetailResponse['data']>({
    queryKey: adminQueryKeys.crawlDetail(id),
    queryFn: () => fetchCrawlDetail(id),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
    enabled: Boolean(id),
  });
};
