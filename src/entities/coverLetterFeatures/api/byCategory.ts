import { clientFetch } from '@/shared';

export const fetchCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) =>
  clientFetch.get(`/api/cover-letter-features/category/${category}`, {
    params: { page, size, sort },
  });
