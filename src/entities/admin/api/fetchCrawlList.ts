import { clientFetch } from '@/shared';
import { CrawlListResponse } from '@/entities';

export interface FetchCrawlListParams {
  page?: number;
  size?: number;
  sort?: string; // e.g. 'updatedAt,desc'
}

export const fetchCrawlList = async (
  params: FetchCrawlListParams = { page: 0, size: 20 },
): Promise<CrawlListResponse> => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.size !== undefined) query.set('size', String(params.size));
  if (params.sort) query.set('sort', params.sort);

  return clientFetch.get(`/api/crawled-cover-letters/?${query.toString()}`);
};
