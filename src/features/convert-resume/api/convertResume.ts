import { clientFetch } from '@/shared';
import { ConvertResumeResponse } from '../model';

export const convertResume = async (
  file: File,
): Promise<ConvertResumeResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return clientFetch.post('/api/v1/resume-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
