import { clientFetch } from '@/shared';

export interface ChangeMemberRoleRequest {
  role: 'USER' | 'ADMIN' | 'ROOT';
  reason: string;
}

export const changeMemberRole = (
  memberId: number,
  data: ChangeMemberRoleRequest,
) => {
  return clientFetch.put(`/api/v1/admin/${memberId}/role`, data);
};
