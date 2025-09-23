import { clientFetch } from '@/shared';
import type { ApiFeaturePageResponse } from '../model/type';

export const fetchCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) =>
  clientFetch.get<ApiFeaturePageResponse>(
    `/api/cover-letter-features/category/${category}`,
    {
      params: { page, size, sort },
    },
  );
