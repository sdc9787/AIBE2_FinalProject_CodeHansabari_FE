import type {
  InterviewQna,
  InterviewQnaListResponse,
  CustomQuestionAnswerResponse,
  CreateInterviewQuestionsResponse,
} from '../type';

// 모킹용 면접 질문/답변 데이터
export const mockInterviewQnas: InterviewQna[] = [
  {
    qnaId: 1,
    question: '프로젝트 경험에 대해 말씀해주세요.',
    answer:
      '저는 대학에서 팀 프로젝트를 통해 React와 Node.js를 활용한 웹 애플리케이션을 개발했습니다. 프론트엔드 개발을 담당하며 사용자 인터페이스 설계와 API 연동을 맡았고, 팀원들과의 협업을 통해 성공적으로 프로젝트를 완성했습니다.',
    tip: '구체적인 역할과 성과를 강조하세요. 사용한 기술 스택과 해결한 문제점을 명확히 설명하면 좋습니다.',
    createdAt: '2025-09-05T14:30:00',
  },
  {
    qnaId: 2,
    question: '가장 도전적이었던 경험은 무엇인가요?',
    answer:
      '팀 프로젝트에서 기존 API가 예상과 다르게 동작하여 전체 일정이 지연될 위기가 있었습니다. 이를 해결하기 위해 백엔드 팀과 긴밀히 소통하며 API 스펙을 재정의하고, 프론트엔드 코드를 최적화하여 결국 예정된 기한 내에 프로젝트를 완성했습니다.',
    tip: '문제 상황과 해결 과정, 그리고 결과를 구체적으로 설명하세요. 협업 능력과 문제 해결 능력을 어필할 수 있습니다.',
    createdAt: '2025-09-05T14:35:00',
  },
  {
    qnaId: 3,
    question: '본인의 강점과 약점을 말씀해주세요.',
    answer:
      '제 강점은 새로운 기술을 빠르게 학습하고 적용하는 능력입니다. 약점은 완벽주의 성향으로 때로는 세부사항에 너무 매몰되어 전체적인 진행 속도가 늦어질 때가 있습니다. 이를 개선하기 위해 우선순위를 명확히 하고 시간 관리를 체계적으로 하려고 노력하고 있습니다.',
    tip: '약점을 언급할 때는 반드시 개선 노력과 함께 이야기하세요. 강점은 지원하는 직무와 연관성이 있는 것으로 선택하는 것이 좋습니다.',
    createdAt: '2025-09-05T14:40:00',
  },
  {
    qnaId: 4,
    question: '왜 우리 회사에 지원하셨나요?',
    answer:
      '귀사는 혁신적인 기술로 사용자 경험을 개선하는 것으로 유명합니다. 특히 최근 출시한 서비스의 사용자 중심적인 접근 방식에 깊은 인상을 받았고, 이러한 환경에서 제가 가진 프론트엔드 개발 역량을 발휘하며 성장하고 싶습니다.',
    tip: '회사에 대한 구체적인 정보를 바탕으로 답변하세요. 단순히 좋은 회사라는 추상적인 표현보다는 구체적인 사업 분야나 기술에 대한 관심을 보여주는 것이 좋습니다.',
    createdAt: '2025-09-05T14:45:00',
  },
  {
    qnaId: 5,
    question: '5년 후 본인의 모습을 어떻게 그리고 있나요?',
    answer:
      '5년 후에는 풀스택 개발자로 성장하여 기술적 리더십을 발휘하고 싶습니다. 프론트엔드 전문성을 바탕으로 백엔드 기술까지 확장하여 프로젝트 전체를 이해하고 방향성을 제시할 수 있는 개발자가 되고 싶습니다.',
    tip: '현실적이면서도 구체적인 목표를 제시하세요. 회사의 성장 방향과 일치하는 커리어 비전을 보여주면 더욱 좋습니다.',
    createdAt: '2025-09-05T14:50:00',
  },
];

// 자소서 ID별 면접 질문 매핑
export const mockInterviewQnaByLetter: Record<number, InterviewQna[]> = {
  1: mockInterviewQnas.slice(0, 0), // 첫 번째 자소서: 3개 질문
  2: mockInterviewQnas.slice(0, 5), // 두 번째 자소서: 5개 질문
  3: mockInterviewQnas.slice(0, 2), // 세 번째 자소서: 2개 질문
};

// 면접 질문 목록 응답 생성 함수
export const createMockInterviewQnaListResponse = (
  coverLetterId: number,
): InterviewQnaListResponse => {
  const qnaList = mockInterviewQnaByLetter[coverLetterId] || [];

  return {
    success: true,
    message: '면접 질문/답변 조회 성공',
    data: {
      qnaList,
      totalCount: qnaList.length,
      generatedCount: qnaList.length,
    },
  };
};

// 새로운 질문 생성 응답
export const createMockCreateQuestionsResponse = (
  coverLetterId: number,
): CreateInterviewQuestionsResponse => {
  // 기존 질문 수 확인
  const existingQnas = mockInterviewQnaByLetter[coverLetterId] || [];
  const newQnaId = Math.max(...mockInterviewQnas.map((q) => q.qnaId)) + 1;

  // 새로운 질문 생성 (예시)
  const newQna: InterviewQna = {
    qnaId: newQnaId,
    question: '팀워크를 발휘한 경험에 대해 설명해주세요.',
    answer:
      '대학교 캡스톤 프로젝트에서 5명의 팀원과 함께 웹 애플리케이션을 개발했습니다. 각자의 강점을 파악하여 역할을 분담하고, 정기적인 회의를 통해 진행 상황을 공유했습니다. 의견 충돌이 있을 때는 데이터와 사용자 관점에서 판단하여 합리적인 결정을 내렸습니다.',
    tip: '구체적인 상황과 본인의 역할, 그리고 결과를 명확히 제시하세요. 갈등 해결 경험이 있다면 더욱 좋습니다.',
    createdAt: new Date().toISOString(),
  };

  // 기존 데이터에 추가
  mockInterviewQnaByLetter[coverLetterId] = [...existingQnas, newQna];

  return {
    success: true,
    message: '면접 질문/답변 생성 성공',
    data: {
      qnaList: [newQna],
      totalCount: mockInterviewQnaByLetter[coverLetterId].length,
      generatedCount: mockInterviewQnaByLetter[coverLetterId].length,
    },
  };
};

// 커스텀 질문 답변 생성 응답
export const createMockCustomAnswerResponse = (
  question: string,
): CustomQuestionAnswerResponse => {
  return {
    success: true,
    message: '커스텀 질문 답변 생성 성공',
    data: {
      answer: `${question}에 대한 답변으로, 저는 이러한 상황에서 체계적인 접근 방식을 사용합니다. 먼저 문제를 명확히 파악하고, 가능한 해결책들을 검토한 후, 가장 효과적인 방안을 선택하여 실행합니다.`,
      tip: '구체적인 사례와 함께 답변하시고, 본인의 경험과 연결지어 설명하면 더욱 효과적입니다.',
    },
  };
};
