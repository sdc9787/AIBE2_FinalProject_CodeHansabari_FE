import { clientFetch } from '@/shared';
import { CreateResumeRequest } from '../model';

interface CreateResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

export const createResume = async (
  data: CreateResumeRequest,
): Promise<CreateResumeResponse> => {
  return clientFetch.post('/api/v1/resumes', data);
};
