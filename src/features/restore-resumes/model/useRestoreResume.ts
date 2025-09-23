import { useCustomMutation } from '@/shared';
import { restoreResume } from '@/features/restore-resumes/api';

export const useRestoreResume = () => {
  return useCustomMutation({
    mutationFn: (resumeId: number) => restoreResume(resumeId),
    successMessage: '이력서가 복구되었습니다.',
    invalidateQueryKeys: [['admin', 'resumes', 'list']],
  });
};
