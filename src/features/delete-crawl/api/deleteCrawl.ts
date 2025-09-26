import { clientFetch } from '@/shared';

export const deleteCrawl = (crawlId?: number) => {
  if (!crawlId) {
    return clientFetch.delete(`/api/crawled-cover-letters/`);
  }

  return clientFetch.delete(`/api/crawled-cover-letters/${crawlId}`);
};
