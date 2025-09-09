import { clientFetch } from '@/shared';
import { ResumeResponse } from '../model';

export const fetchResumeDetail = async (
  resumeId: number,
): Promise<ResumeResponse> => {
  return clientFetch.get(`/api/v1/resumes/${resumeId}`);
};
