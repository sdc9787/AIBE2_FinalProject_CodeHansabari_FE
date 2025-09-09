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
