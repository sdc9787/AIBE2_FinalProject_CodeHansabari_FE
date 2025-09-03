import { clientFetch } from '@/shared';
import { mockImproveCoverLetterResponse, mockImproveCoverLetterResponseVariations, simulateApiCall } from '../model/mock';

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
  // 개발 환경에서 목 데이터 사용 (환경변수나 플래그로 제어 가능)
  const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
  
  if (USE_MOCK_DATA) {
    // 다양한 응답을 위해 랜덤하게 선택
    const responses = [mockImproveCoverLetterResponse, ...mockImproveCoverLetterResponseVariations];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // API 호출 시뮬레이션 (2초 딜레이)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return randomResponse as ImproveCoverLetterResponse;
  }

  // 실제 API 호출
  const response = await clientFetch.post('/api/v1/cover-letters/ai-improve', {
    content: requestData.content,
    jobField: requestData.jobField,
    experienceYears: requestData.experienceYears,
    customPrompt: requestData.customPrompt,
  });
  return response;
};

// 목 데이터를 강제로 사용하는 함수 (테스트용)
export const improveCoverLetterMock = async (
  requestData: ImproveCoverLetterRequest,
): Promise<ImproveCoverLetterResponse> => {
  const responses = [mockImproveCoverLetterResponse, ...mockImproveCoverLetterResponseVariations];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return randomResponse as ImproveCoverLetterResponse;
};
