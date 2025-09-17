import { clientFetch } from '@/shared';

export const restoreResume = (resumeId: number) => {
  return clientFetch.patch(`/api/v1/admin/resumes/${resumeId}/restore`);
};
