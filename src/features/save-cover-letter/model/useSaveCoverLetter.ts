import { useCustomMutation } from '@/shared/lib/useCustomMutation';
import { saveCoverLetter } from '../api';

interface SaveCoverLetterRequest {
  title: string;
  content: string;
  jobField: string;
  experienceYears: number;
  isAiImproved: boolean;
}

interface SaveCoverLetterResponse {
  success: boolean;
  message: string;
  data: null;
}

export const useSaveCoverLetter = () => {
  return useCustomMutation<SaveCoverLetterRequest, SaveCoverLetterResponse>({
    mutationFn: (requestData) => saveCoverLetter(requestData),
    successMessage: '원본 자소서가 저장되었습니다.',
  });
};
