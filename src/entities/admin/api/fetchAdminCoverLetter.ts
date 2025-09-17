import { clientFetch } from '@/shared';
import {
  AdminCoverLetterListResponse,
  FetchAdminCoverLettersParams,
} from '../model';

export const fetchAdminCoverLetters = async (
  params: FetchAdminCoverLettersParams,
): Promise<AdminCoverLetterListResponse> => {
  const { page, size, status = 'DELETED', email, title } = params;
  const sp = new URLSearchParams();
  sp.set('page', String(page));
  sp.set('size', String(size));
  if (status) sp.set('status', status);
  if (email) sp.set('email', email);
  if (title) sp.set('title', title);

  return clientFetch.get(`/api/v1/admin/cover-letters?${sp}`);
};
