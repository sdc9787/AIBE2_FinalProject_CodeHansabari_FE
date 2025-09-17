import { clientFetch } from '@/shared';

export const updateCrawl = (crawlId: number) => {
  return clientFetch.put(`/api/crawl/cover-letters/${crawlId}`);
};
