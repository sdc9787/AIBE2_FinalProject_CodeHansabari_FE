import { useCustomMutation } from '@/shared/lib';
import {
  updateResume,
  UpdateResumeRequest,
  FetchResumeListParams,
} from '@/entities';

interface UpdateResumeResponse {
  success: boolean;
  message: string;
  data: null;
}

interface UpdateResumeArgs {
  resumeId: number;
  data: UpdateResumeRequest;
}

export const useUpdateResumeMutation = ({
  params,
  resumeId,
}: {
  params: FetchResumeListParams;
  resumeId: number;
}) => {
  return useCustomMutation<UpdateResumeRequest, UpdateResumeResponse>({
    mutationFn: (data: UpdateResumeRequest) => updateResume(resumeId, data),
    successMessage: '이력서가 성공적으로 수정되었습니다.',
    invalidateQueryKeys: [['resumeList', params], ['resumeDetail']],
  });
};
