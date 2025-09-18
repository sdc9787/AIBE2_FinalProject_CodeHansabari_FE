import { clientFetch } from '@/shared';

export const updateCrawl = (crawlId: number, text: string) => {
  return clientFetch.put(`/api/crawled-cover-letters/${crawlId}`, {
    text,
  });
};
