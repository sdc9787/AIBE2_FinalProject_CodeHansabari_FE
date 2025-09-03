'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCustomMutation } from '@/shared/lib/useCustomMutation';
import { improveCoverLetter } from '../api/improveCoverLetter';

interface ImproveCoverLetterRequest {
  content: string;
  jobField: string;
  experienceYears: number;
  customPrompt: string;
}

interface FeedbackItem {
  description: string;
  suggestion: string;
}

interface CoverLetterFeedback {
  strengths: FeedbackItem[];
  improvements: FeedbackItem[];
  summary: string;
}

interface ImproveCoverLetterResponse {
  success: boolean;
  message: string;
  data: {
    feedback: CoverLetterFeedback;
    improvedContent: string;
  };
}

export const useImproveCoverLetterMutation = () => {
  return useCustomMutation<
    ImproveCoverLetterRequest,
    ImproveCoverLetterResponse
  >({
    mutationFn: (requestData) => improveCoverLetter(requestData),
    successMessage: '자소서 AI 개선이 완료되었습니다.',
  });
};
