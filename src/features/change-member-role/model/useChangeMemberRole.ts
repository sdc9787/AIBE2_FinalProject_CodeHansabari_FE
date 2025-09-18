import { useCustomMutation } from '@/shared';
import { changeMemberRole, ChangeMemberRoleRequest } from '../api';

export const useChangeMemberRole = () => {
  return useCustomMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number;
      data: ChangeMemberRoleRequest;
    }) => changeMemberRole(memberId, data),
    successMessage: '회원 역할이 변경되었습니다.',
    invalidateQueryKeys: [['adminMembers'], ['adminMemberDetail']],
  });
};
