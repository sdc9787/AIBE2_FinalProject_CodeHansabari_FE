import { clientFetch } from '@/shared';
import { CoverLetterDetailResponse } from '@/entities';

export const fetchCoverLetterDetail = async (
  coverLetterId: number,
): Promise<CoverLetterDetailResponse> => {
  return clientFetch.get(`/api/v1/cover-letters/${coverLetterId}`);
};
