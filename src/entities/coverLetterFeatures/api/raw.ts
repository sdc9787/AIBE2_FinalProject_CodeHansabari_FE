import { clientFetch } from '@/shared';

export const fetchRawCoverLetterFeatures = (
  page = 0,
  size = 20,
  sort?: string,
) =>
  clientFetch.get('/api/cover-letter-features/raw', {
    params: { page, size, sort },
  });
