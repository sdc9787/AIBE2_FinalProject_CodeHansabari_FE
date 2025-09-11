import { clientFetch } from '@/shared';
import { ResumeMetadata } from '../model';

export const fetchResumeMetadata = async (): Promise<ResumeMetadata> => {
  return clientFetch.get(`/api/v1/resume-metadata`);
};
