import { clientFetch } from '@/shared';
import { UpdateResumeRequest, ResumeResponse } from '../model';

export const updateResume = async (
  resumeId: number,
  data: UpdateResumeRequest,
): Promise<ResumeResponse> => {
  return clientFetch.put(`/api/v1/resumes/${resumeId}`, data);
};
