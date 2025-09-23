import { clientFetch } from '@/shared';
import type { ApiRawByCategoryResponse } from '../model/type';

export const fetchRawCoverLetterFeaturesByCategory = (
  category: string,
  page = 0,
  size = 20,
  sort?: string,
) =>
  clientFetch.get<ApiRawByCategoryResponse>(
    `/api/cover-letter-features/raw/category/${category}`,
    {
      params: { page, size, sort },
    },
  );
