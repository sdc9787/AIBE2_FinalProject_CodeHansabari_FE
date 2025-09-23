import { clientFetch } from '@/shared';

export const fetchCoverLetterFeatures = (page = 0, size = 20, sort?: string) =>
  clientFetch.get('/api/cover-letter-features', {
    params: { page, size, sort },
  });
