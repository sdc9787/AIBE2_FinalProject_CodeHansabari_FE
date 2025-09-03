import { clientFetch } from '@/shared';

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

export const improveCoverLetter = async (
  requestData: ImproveCoverLetterRequest,
): Promise<ImproveCoverLetterResponse> => {
  const response = await clientFetch.post('/api/v1/cover-letters/ai-improve', {
    content: requestData.content,
    jobField: requestData.jobField,
    experienceYears: requestData.experienceYears,
    customPrompt: requestData.customPrompt,
  });
  return response;
};
