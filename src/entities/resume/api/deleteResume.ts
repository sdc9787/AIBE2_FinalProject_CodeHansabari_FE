import { clientFetch } from '@/shared';

export const deleteResume = async (resumeId: number): Promise<void> => {
  return clientFetch.delete(`/api/v1/resumes/${resumeId}`);
};
