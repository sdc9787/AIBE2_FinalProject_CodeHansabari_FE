import { clientFetch } from '@/shared';
import type { ApiStatisticsResponse } from '../model/type';

export const fetchCoverLetterFeaturesStatistics = () =>
  clientFetch.get<ApiStatisticsResponse>(
    '/api/cover-letter-features/statistics',
  );
