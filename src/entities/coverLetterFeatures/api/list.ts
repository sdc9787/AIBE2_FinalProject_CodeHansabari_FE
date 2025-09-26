import { clientFetch } from '@/shared';
import type { ApiFeaturePageResponse } from '../model/type';

export const fetchCoverLetterFeatures = (page = 0, size = 20, sort?: string) =>
  clientFetch.get<ApiFeaturePageResponse>('/api/cover-letter-features/', {
    params: { page, size, sort },
  });
