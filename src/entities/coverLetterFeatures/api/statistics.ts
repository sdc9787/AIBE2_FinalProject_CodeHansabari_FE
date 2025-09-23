import { clientFetch } from '@/shared';

export const fetchCoverLetterFeaturesStatistics = () =>
  clientFetch.get('/api/cover-letter-features/statistics');
