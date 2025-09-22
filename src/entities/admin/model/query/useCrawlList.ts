import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './queryKey';
import { CrawlListResponse } from '../type';
import {
  fetchCrawlList,
  FetchCrawlListParams,
} from '@/entities/admin/api/fetchCrawlList';

export const useCrawlList = (
  params: FetchCrawlListParams = { page: 0, size: 20 },
) => {
  return useQuery<CrawlListResponse, Error, CrawlListResponse['data']>({
    queryKey: adminQueryKeys.crawlList(
      params.page ?? 0,
      params.size ?? 20,
      params.sort,
    ),
    queryFn: () => fetchCrawlList(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
};
