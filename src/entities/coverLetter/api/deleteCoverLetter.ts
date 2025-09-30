import { clientFetch } from '@/shared';

export const deleteCoverLetter = async (coverLetterId: number) => {
  return clientFetch.delete(`/api/v1/cover-letters/${coverLetterId}`);
};
