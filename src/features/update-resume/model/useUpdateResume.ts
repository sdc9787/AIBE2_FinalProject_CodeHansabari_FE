import { useCustomMutation } from '@/shared/lib';
import { updateResume, UpdateResumeRequest } from '@/entities';

interface UpdateResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

export const useUpdateResumeMutation = ({ resumeId }: { resumeId: number }) => {
  return useCustomMutation<UpdateResumeRequest, UpdateResumeResponse>({
    mutationFn: (data: UpdateResumeRequest) => updateResume(resumeId, data),
    successMessage: '이력서가 성공적으로 수정되었습니다.',
    invalidateQueryKeys: [['resumeList'], ['resumeDetail', resumeId]],
  });
};
