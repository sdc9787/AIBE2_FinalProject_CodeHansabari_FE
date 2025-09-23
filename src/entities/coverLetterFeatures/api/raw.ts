import { clientFetch } from '@/shared';
import type { ApiRawPageResponse } from '../model/type';

export const fetchRawCoverLetterFeatures = (
  page = 0,
  size = 20,
  sort?: string,
) =>
  clientFetch.get<ApiRawPageResponse>('/api/cover-letter-features/raw', {
    params: { page, size, sort },
  });
