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
