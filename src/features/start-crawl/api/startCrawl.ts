import { clientFetch } from '@/shared';

export const startCrawl = () => {
  return clientFetch.post(`/api/crawl/cover-letters`);
};
