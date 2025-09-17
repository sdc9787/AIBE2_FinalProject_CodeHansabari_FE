import { useCustomMutation } from '@/shared';
import { restoreResume } from '@/features/restore-resumes/api';

export const useRestoreResume = (resumeId?: number) => {
  return useCustomMutation({
    mutationFn: () => restoreResume(resumeId as number),
    successMessage: '이력서가 복구되었습니다.',
    invalidateQueryKeys: [['admin', 'resumes', 'list']],
  });
};
