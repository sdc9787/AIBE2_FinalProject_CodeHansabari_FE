import { clientFetch } from '@/shared';

export const fetchRawCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) =>
  clientFetch.get(`/api/cover-letter-features/raw/category/${category}`, {
    params: { page, size, sort },
  });
