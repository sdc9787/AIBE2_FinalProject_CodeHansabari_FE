import { clientFetch } from '@/shared';

export const deleteCrawl = (crawlId?: number) => {
  if (!crawlId) {
    return clientFetch.delete(`/api/crawl/cover-letters`);
  }

  return clientFetch.delete(`/api/crawl/cover-letters/${crawlId}`);
};
