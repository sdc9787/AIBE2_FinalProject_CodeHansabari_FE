import { clientFetch } from '@/shared';
import { CrawlListResponse } from '@/entities';

export const fetchCrawlList = async (): Promise<CrawlListResponse> => {
  return clientFetch.get(`/api/crawl/cover-letters`);
};
