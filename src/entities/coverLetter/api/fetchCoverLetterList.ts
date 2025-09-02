import { clientFetch } from '@/shared';
import { CoverLetterListResponse } from '@/entities';

export const fetchCoverLetterList = async (
  page: number,
  view: 'thumbnail' | 'all',
): Promise<CoverLetterListResponse> => {
  return clientFetch.get(`/api/v1/cover-letters?page=${page}&view=${view}`);
};
