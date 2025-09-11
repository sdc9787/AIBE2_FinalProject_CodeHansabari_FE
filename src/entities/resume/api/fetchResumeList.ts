import { clientFetch } from '@/shared';
import { ResponseResumeList } from '../model';

export interface FetchResumeListParams {
  page?: number;
  size?: number;
}

export const fetchResumeList = async (
  params: FetchResumeListParams = {},
): Promise<ResponseResumeList> => {
  const { page = 0, size = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return clientFetch.get(`/api/v1/resumes?${searchParams}`);
};
