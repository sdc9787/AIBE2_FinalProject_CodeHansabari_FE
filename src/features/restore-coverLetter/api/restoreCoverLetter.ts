import { clientFetch } from '@/shared';

export const restoreCoverLetter = (coverLetterId: number) => {
  return clientFetch.patch(
    `/api/v1/admin/cover-letters/${coverLetterId}/restore`,
  );
};
