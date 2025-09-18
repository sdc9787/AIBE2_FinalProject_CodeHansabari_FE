import { clientFetch } from '@/shared';
import { AdminMemberListResponse, FetchAdminMembersParams } from '../model';

export const fetchAdminMembers = async (
  params: FetchAdminMembersParams,
): Promise<AdminMemberListResponse> => {
  const {
    page = 0,
    size = 10,
    email,
    name,
    role,
    status,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  } = params;

  const sp = new URLSearchParams();
  sp.set('page', String(page));
  sp.set('size', String(size));
  if (email) sp.set('email', email);
  if (name) sp.set('name', name);
  if (role) sp.set('role', role);
  if (status) sp.set('status', status);
  sp.set('sortBy', sortBy);
  sp.set('sortDirection', sortDirection);

  return clientFetch.get(`/api/v1/admin?${sp}`);
};
