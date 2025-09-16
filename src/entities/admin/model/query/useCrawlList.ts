import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import { CrawlListResponse } from '../type';
import { fetchCrawlList } from '@/entities/admin/api/fetchCrawlList';

export const useCrawlList = () => {
  return useQuery<CrawlListResponse, Error, CrawlListResponse['data']>({
    queryKey: adminQueryKeys.crawlList(),
    queryFn: () => fetchCrawlList(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};
