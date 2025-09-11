import { clientFetch } from '@/shared';
import { UpdateResumeRequest } from '../model';

export const updateResume = async (
  resumeId: number,
  data: UpdateResumeRequest,
): Promise<void> => {
  return clientFetch.put(`/api/v1/resumes/${resumeId}`, data);
};
