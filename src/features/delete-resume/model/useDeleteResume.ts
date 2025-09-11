import { useCustomMutation } from '@/shared/lib';
import { deleteResume, FetchResumeListParams } from '@/entities';

interface DeleteResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

export const useDeleteResumeMutation = (params: FetchResumeListParams) => {
  return useCustomMutation<number, void>({
    mutationFn: (resumeId: number) => deleteResume(resumeId),
    successMessage: '이력서가 성공적으로 삭제되었습니다.',
    invalidateQueryKeys: [['resumeList', params]],
  });
};
