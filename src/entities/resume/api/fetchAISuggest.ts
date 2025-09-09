import { clientFetch } from '@/shared';
import { AISuggestRequest, AISuggestApiResponse } from '../model';

export const fetchAISuggest = async (
  data: AISuggestRequest,
): Promise<AISuggestApiResponse> => {
  return clientFetch.post('/api/v1/resumes/ai-suggest', data);
};
