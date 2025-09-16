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
    invalidateQueryKeys: [['coverLetters', 'list']],
    loadingType: 'none',
  });
};
