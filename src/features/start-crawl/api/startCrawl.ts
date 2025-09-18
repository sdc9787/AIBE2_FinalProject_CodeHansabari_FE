import { clientFetch } from '@/shared';

export const startCrawl = () => {
  return clientFetch.post(`/api/crawled-cover-letters`);
};
