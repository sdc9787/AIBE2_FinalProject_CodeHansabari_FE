import { clientFetch } from '@/shared';
import { CreateResumeRequest } from '../model';

export const createResume = async (
  data: CreateResumeRequest,
): Promise<void> => {
  return clientFetch.post('/api/v1/resumes', data);
};
