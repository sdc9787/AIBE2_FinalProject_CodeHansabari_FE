import { useCustomMutation } from '@/shared/lib';
import { deleteResume } from '@/entities';

export const useDeleteResumeMutation = () => {
  return useCustomMutation<number, void>({
    mutationFn: (resumeId: number) => deleteResume(resumeId),
    successMessage: '이력서가 성공적으로 삭제되었습니다.',
    invalidateQueryKeys: [['resumeList']],
  });
};
