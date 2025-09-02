import { clientFetch } from '@/shared';
import { CoverLetterListResponse } from '@/entities';

export const fetchCoverLetterList =
  async (): Promise<CoverLetterListResponse> => {
    return clientFetch.get(`/api/v1/cover-letters`);
  };
