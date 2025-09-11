import { clientFetch } from '@/shared';
import { UpdateResumeRequest } from '../model';

interface UpdateResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

export const updateResume = async (
  resumeId: number,
  data: UpdateResumeRequest,
): Promise<UpdateResumeResponse> => {
  return clientFetch.put(`/api/v1/resumes/${resumeId}`, data);
};
