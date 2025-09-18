import { useCustomMutation } from '@/shared';
import { changeMemberStatus, ChangeMemberStatusRequest } from '../api';

export const useChangeMemberStatus = () => {
  return useCustomMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number;
      data: ChangeMemberStatusRequest;
    }) => changeMemberStatus(memberId, data),
    successMessage: '회원 상태가 변경되었습니다.',
    invalidateQueryKeys: [['adminMembers'], ['adminMemberDetail']],
  });
};
