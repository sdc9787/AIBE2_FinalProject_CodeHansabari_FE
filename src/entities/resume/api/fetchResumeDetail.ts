import { clientFetch } from '@/shared';
import { ResponseResumeDetail } from '../model';

export const fetchResumeDetail = async (
  resumeId: number,
): Promise<ResponseResumeDetail> => {
  return clientFetch.get(`/api/v1/resumes/${resumeId}`);
};
