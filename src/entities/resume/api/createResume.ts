import { clientFetch } from '@/shared';
import { CreateResumeRequest, ResumeResponse } from '../model';

export const createResume = async (
  data: CreateResumeRequest,
): Promise<ResumeResponse> => {
  return clientFetch.post('/api/v1/resumes', data);
};
