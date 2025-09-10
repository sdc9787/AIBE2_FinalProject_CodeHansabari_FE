// 면접 질문/답변 데이터 타입
export interface InterviewQna {
  qnaId: number; // 질문 ID
  question: string; // 질문 내용
  answer: string; // 답변 내용
  tip: string; // 답변 팁
  createdAt: string; // 질문 생성일
}

// 면접 질문/답변 목록 응답 타입
export interface InterviewQnaListData {
  qnaList: InterviewQna[]; // 질문/답변 목록
  totalCount: number; // 질문 생성 개수 + 커스텀 질문 개수
  generatedCount: number; // 질문 생성 개수
}

// API 응답 타입
export interface InterviewQnaListResponse {
  success: boolean; // 요청 성공 여부
  message: string; // 요청 메시지
  data: InterviewQnaListData; // 요청 데이터
}

// 커스텀 질문 요청 타입
export interface CustomQuestionRequest {
  question: string; // 사용자 질문
}

// 커스텀 질문 답변 데이터 타입
export interface CustomQuestionAnswerData {
  answer: string; // AI 생성 답변
  tip: string; // 답변 팁
}

// 커스텀 질문 답변 응답 타입
export interface CustomQuestionAnswerResponse {
  success: boolean; // 요청 성공 여부
  message: string; // 요청 메시지
  data: CustomQuestionAnswerData; // 응답 데이터
}

// 면접 질문 생성 응답 타입 (기존 InterviewQnaListResponse와 동일한 구조)
export interface CreateInterviewQuestionsResponse {
  success: boolean; // 요청 성공 여부
  message: string; // 요청 메시지
  data: InterviewQnaListData; // 응답 데이터
}
