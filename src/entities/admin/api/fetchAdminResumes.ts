import { clientFetch } from '@/shared';
import { AdminResumeListResponse, FetchAdminResumesParams } from '../model';

export const fetchAdminResumes = async (
  params: FetchAdminResumesParams,
): Promise<AdminResumeListResponse> => {
  const { page, size, status = 'DELETED', email, title } = params;

  const sp = new URLSearchParams();
  sp.set('page', String(page));
  sp.set('size', String(size));
  if (status) sp.set('status', status);
  if (email) sp.set('email', email);
  if (title) sp.set('title', title);

  return clientFetch.get(`/api/v1/admin/resumes?${sp}`);
};
