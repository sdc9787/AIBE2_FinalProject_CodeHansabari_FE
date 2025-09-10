'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCoverLetterList,
  useInterviewQuestions,
  InterviewQna,
  CoverLetterItem,
} from '@/entities';
import {
  useCreateInterviewQuestions,
  useCreateCustomQuestionAnswer,
} from '@/features';
import { Button, Textarea } from '@/shared';

export function InterviewQuestions() {
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<
    number | null
  >(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [showCustomAnswer, setShowCustomAnswer] = useState(false);
  const [customAnswer, setCustomAnswer] = useState<{
    answer: string;
    tip: string;
  } | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // 자기소개서 목록 가져오기
  const { data: coverLetters, isLoading: isCoverLettersLoading } =
    useCoverLetterList(1, 'all');

  // 선택된 자소서의 면접 질문들 가져오기
  const { data: interviewData, isLoading: isQuestionsLoading } =
    useInterviewQuestions(selectedCoverLetterId || undefined);

  // 면접 질문 생성 mutation
  const createQuestions = useCreateInterviewQuestions({
    coverLetterId: selectedCoverLetterId || 0,
  });

  // 커스텀 질문 답변 생성 mutation
  const createCustomAnswer = useCreateCustomQuestionAnswer({
    coverLetterId: selectedCoverLetterId || 0,
  });

  const handleGenerateQuestions = () => {
    if (selectedCoverLetterId) {
      createQuestions.mutate();
    }
  };

  const handleCustomQuestion = async () => {
    if (selectedCoverLetterId && customQuestion.trim()) {
      try {
        const result = await createCustomAnswer.mutateAsync({
          question: customQuestion,
        });
        setCustomAnswer(result.data);
        setShowCustomAnswer(true);
      } catch (error) {
        console.error('커스텀 질문 생성 실패:', error);
      }
    }
  };

  const toggleQuestion = (qnaId: number) => {
    // 같은 질문을 클릭하면 닫기, 다른 질문을 클릭하면 해당 질문만 열기
    setExpandedQuestion(expandedQuestion === qnaId ? null : qnaId);
  };

  // 자소서가 변경될 때 확장된 질문 초기화
  useEffect(() => {
    setExpandedQuestion(null);
  }, [selectedCoverLetterId]);

  if (isCoverLettersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            AI 모의면접 질문
          </h1>
          <p className="text-lg text-gray-600">
            자소서를 기반으로 맞춤형 면접 질문을 생성하고 연습해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 좌측: 자소서 선택 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                자소서 선택
              </h2>

              {coverLetters?.content && coverLetters.content.length > 0 ? (
                <div className="space-y-3">
                  {coverLetters.content.map((coverLetter: CoverLetterItem) => (
                    <motion.button
                      key={coverLetter.coverLetterId}
                      onClick={() =>
                        setSelectedCoverLetterId(coverLetter.coverLetterId)
                      }
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        selectedCoverLetterId === coverLetter.coverLetterId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="truncate font-medium text-gray-900">
                        {coverLetter.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(coverLetter.createdAt).toLocaleDateString()}
                      </p>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">작성된 자소서가 없습니다.</p>
                  <Button className="mt-4">자소서 작성하기</Button>
                </div>
              )}

              {/* 질문 생성 버튼 */}
              {selectedCoverLetterId && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <Button
                    onClick={handleGenerateQuestions}
                    disabled={createQuestions.isPending}
                    className="w-full"
                  >
                    {createQuestions.isPending ? '생성중...' : '면접 질문 생성'}
                  </Button>

                  {interviewData && (
                    <p className="mt-2 text-center text-sm text-gray-500">
                      현재 {interviewData.generatedCount}개 질문 생성됨
                      {interviewData.totalCount !==
                        interviewData.generatedCount &&
                        ` (총 ${interviewData.totalCount}개)`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 우측: 질문 목록 및 커스텀 질문 */}
          <div className="space-y-6 lg:col-span-2">
            {selectedCoverLetterId ? (
              <>
                {/* 생성된 질문 목록 */}
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    생성된 면접 질문
                  </h2>

                  {isQuestionsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-lg border p-4">
                          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                        </div>
                      ))}
                    </div>
                  ) : interviewData && interviewData.qnaList.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {interviewData.qnaList.map(
                          (qna: InterviewQna, index: number) => (
                            <motion.div
                              key={qna.qnaId}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.1 }}
                              className="rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                            >
                              <button
                                onClick={() => toggleQuestion(qna.qnaId)}
                                className="w-full p-6 text-left transition-colors hover:bg-gray-50"
                              >
                                <div className="flex items-start justify-between">
                                  <h3 className="flex-1 pr-4 text-lg font-medium text-gray-900">
                                    Q{index + 1}. {qna.question}
                                  </h3>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        qna.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                    <motion.div
                                      animate={{
                                        rotate:
                                          expandedQuestion === qna.qnaId
                                            ? 180
                                            : 0,
                                      }}
                                      transition={{ duration: 0.2 }}
                                      className="text-gray-400"
                                    >
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </motion.div>
                                  </div>
                                </div>
                              </button>

                              <AnimatePresence>
                                {expandedQuestion === qna.qnaId && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-4 border-t border-gray-100 p-6">
                                      <div>
                                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                                          💬 모범 답변
                                        </h4>
                                        <p className="rounded-lg bg-gray-50 p-4 leading-relaxed text-gray-600">
                                          {qna.answer}
                                        </p>
                                      </div>

                                      <div>
                                        <h4 className="mb-2 text-sm font-medium text-blue-700">
                                          💡 답변 팁
                                        </h4>
                                        <p className="rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-blue-600">
                                          {qna.tip}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ),
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mb-4 text-6xl">🤔</div>
                      <p className="mb-4 text-gray-500">
                        아직 생성된 질문이 없습니다.
                      </p>
                      <p className="text-sm text-gray-400">
                        상단의 &quot;면접 질문 생성&quot; 버튼을 클릭해주세요.
                      </p>
                    </div>
                  )}
                </div>

                {/* 커스텀 질문 섹션 */}
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    나만의 질문 만들기
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        질문을 입력하세요
                      </label>
                      <Textarea
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="예: 팀 프로젝트에서 갈등이 발생했을 때 어떻게 해결하셨나요?"
                        rows={3}
                        className="w-full"
                      />
                    </div>

                    <Button
                      onClick={handleCustomQuestion}
                      disabled={
                        !customQuestion.trim() || createCustomAnswer.isPending
                      }
                      className="w-full"
                    >
                      {createCustomAnswer.isPending
                        ? 'AI 답변 생성중...'
                        : 'AI 답변 생성'}
                    </Button>
                  </div>

                  {/* 커스텀 질문 답변 표시 */}
                  <AnimatePresence>
                    {showCustomAnswer && customAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 rounded-lg border bg-gray-50 p-4"
                      >
                        <h4 className="mb-2 font-medium text-gray-900">
                          Q. {customQuestion}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <h5 className="mb-2 text-sm font-medium text-gray-700">
                              AI 생성 답변
                            </h5>
                            <p className="leading-relaxed text-gray-600">
                              {customAnswer.answer}
                            </p>
                          </div>

                          <div>
                            <h5 className="mb-2 text-sm font-medium text-blue-700">
                              💡 답변 팁
                            </h5>
                            <p className="text-sm leading-relaxed text-blue-600">
                              {customAnswer.tip}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => setShowCustomAnswer(false)}
                          variant="outline"
                          size="sm"
                          className="mt-4"
                        >
                          닫기
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-white p-12 text-center shadow-lg">
                <div className="mb-4 text-6xl">📝</div>
                <h3 className="mb-2 text-xl font-medium text-gray-900">
                  자소서를 선택해주세요
                </h3>
                <p className="text-gray-500">
                  좌측에서 자소서를 선택하면 맞춤형 면접 질문을 생성할 수
                  있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
