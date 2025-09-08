import { clientFetch } from '@/shared';
import { ResumeListResponse } from '../model';

export const fetchResumeList = async (): Promise<ResumeListResponse> => {
  return clientFetch.get('/api/v1/resumes');
};
