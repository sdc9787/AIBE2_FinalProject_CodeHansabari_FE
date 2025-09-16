import { useCustomMutation } from '@/shared/lib';
import { createResume, CreateResumeRequest } from '@/entities';

interface CreateResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

export const useCreateResumeMutation = () => {
  return useCustomMutation<CreateResumeRequest, CreateResumeResponse>({
    mutationFn: (data: CreateResumeRequest) => createResume(data),
    successMessage: '이력서가 성공적으로 생성되었습니다.',
    invalidateQueryKeys: [['resumeList']],
  });
};
