import { useCustomMutation } from '@/shared/lib';
import {
  createResume,
  CreateResumeRequest,
  FetchResumeListParams,
} from '@/entities';

interface CreateResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

export const useCreateResumeMutation = (params: FetchResumeListParams) => {
  return useCustomMutation<CreateResumeRequest, Error, CreateResumeResponse>({
    mutationFn: (data: CreateResumeRequest) => createResume(data),
    successMessage: '이력서가 성공적으로 생성되었습니다.',
    invalidateQueryKeys: [['resumeList', params]],
  });
};
