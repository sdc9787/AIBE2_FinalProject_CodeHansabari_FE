import { clientFetch } from '@/shared';
import { CrawlDetailResponse } from '@/entities';

export const fetchCrawlDetail = async (
  coverLetterId: number,
): Promise<CrawlDetailResponse> => {
  return clientFetch.get(`/api/crawled-cover-letters/${coverLetterId}`);
};
