import { clientFetch } from '@/shared';
import { AdminMemberDetailResponse } from '../model';

export const fetchAdminMemberDetail = async (
  memberId: number,
): Promise<AdminMemberDetailResponse> => {
  return clientFetch.get(`/api/v1/admin/${memberId}`);
};
