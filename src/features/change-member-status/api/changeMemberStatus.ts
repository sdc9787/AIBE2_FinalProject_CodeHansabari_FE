import { clientFetch } from '@/shared';

export interface ChangeMemberStatusRequest {
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  reason: string;
}

export const changeMemberStatus = (
  memberId: number,
  data: ChangeMemberStatusRequest,
) => {
  return clientFetch.put(`/api/v1/admin/${memberId}/status`, data);
};
