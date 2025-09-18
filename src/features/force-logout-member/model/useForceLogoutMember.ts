import { useCustomMutation } from '@/shared';
import { forceLogoutMember } from '../api';

export const useForceLogoutMember = () => {
  return useCustomMutation({
    mutationFn: (memberId: number) => forceLogoutMember(memberId),
    successMessage: '회원이 강제 로그아웃되었습니다.',
    invalidateQueryKeys: [['adminMembers'], ['adminMemberDetail']],
  });
};
