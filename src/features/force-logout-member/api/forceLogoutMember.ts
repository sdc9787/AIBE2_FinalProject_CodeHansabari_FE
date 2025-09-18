import { clientFetch } from '@/shared';

export const forceLogoutMember = (memberId: number) => {
  return clientFetch.post(`/api/v1/admin/${memberId}/force-logout`);
};
