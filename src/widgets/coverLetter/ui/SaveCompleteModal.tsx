'use client';

import { Button } from '@/shared/ui';

interface SaveCompleteModalProps {
  onInterviewQuestions: () => void;
  onLater: () => void;
}

export function SaveCompleteModal({
  onInterviewQuestions,
  onLater,
}: SaveCompleteModalProps) {
  return (
    <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 text-center">
        {/* 완료 아이콘 */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-blue-600">
          자기소개서 저장 완료!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          이제 AI 모의 면접을 통해 실전 연습을 해보세요
        </p>
      </div>

      <div className="space-y-4">
        {/* AI 모의 면접 연습하기 */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                AI 모의 면접 연습하기
              </h3>
              <p className="text-sm text-gray-600">
                완성된 자기소개서를 바탕으로 실제 면접 연습을 제공해보세요
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onInterviewQuestions}
          variant="primary"
          className="w-full bg-blue-600 py-3 font-semibold hover:bg-blue-700"
        >
          🎯 AI 모의 면접 시작하기
        </Button>

        <Button
          onClick={onLater}
          variant="secondary"
          className="w-full border-gray-300 py-3 font-semibold text-white hover:bg-gray-600"
        >
          나중에 하기
        </Button>
      </div>
    </div>
  );
}
