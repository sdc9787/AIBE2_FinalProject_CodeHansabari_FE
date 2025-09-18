import { useCustomMutation } from '@/shared/lib';
import { convertResume } from '../api';
import { ConvertResumeResponse } from './type';

export const useConvertResumeMutation = () => {
  return useCustomMutation<File, ConvertResumeResponse>({
    mutationFn: (file: File) => convertResume(file),
    successMessage: '이력서가 성공적으로 변환되어 저장되었습니다.',
    invalidateQueryKeys: [['resumeList']],
    loadingType: 'global',
    requireTokenCheck: true,
    tokenPreflightStrategy: 'fresh',
    usageToken: 5, // 이 작업이 5 토큰을 소모한다고 가정
  });
};
