'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  useCoverLetterList,
  useCoverLetterDetail,
  CoverLetterItem,
} from '@/entities';
import { Button } from '@/shared';

export default function InterviewQuestionsList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<
    number | null
  >(null);

  // 자기소개서 목록 가져오기
  const { data: coverLetters, isLoading: isCoverLettersLoading } =
    useCoverLetterList(1, 'thumbnail');

  // 선택된 자기소개서 상세 정보 가져오기
  const { data: selectedCoverLetter, isLoading: isDetailLoading } =
    useCoverLetterDetail(selectedCoverLetterId || undefined);

  // 검색어에 따른 필터링된 자기소개서 목록
  const filteredCoverLetters = useMemo(() => {
    if (!coverLetters?.content) return [];

    if (!searchTerm.trim()) {
      return coverLetters.content;
    }

    return coverLetters.content.filter(
      (coverLetter: CoverLetterItem) =>
        coverLetter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coverLetter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coverLetter.jobField.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [coverLetters?.content, searchTerm]);

  // 검색어 하이라이팅 함수
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  // 자기소개서 선택 핸들러
  const handleSelectCoverLetter = (coverLetterId: number) => {
    setSelectedCoverLetterId(coverLetterId);
  };

  // 면접 시작 핸들러
  const handleStartInterview = () => {
    if (selectedCoverLetterId) {
      router.push(`/interview-questions/detail/${selectedCoverLetterId}`);
    }
  };

  // 로딩 상태
  if (isCoverLettersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              자기소개서 목록을 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div
        className="mx-auto max-w-7xl rounded-2xl border-b border-purple-300 text-white"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="px-4 py-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">AI 모의 면접</h1>
            <p className="text-xl font-medium text-purple-100">
              자기소개서를 바탕으로 생성된 맞춤형 면접 질문으로 실전 연습을
              해보세요
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-7xl py-8">
        <div className="flex gap-8">
          {/* 우측 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-8 lg:grid-cols-2">
              {/* 왼쪽: 자기소개서 목록 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                {/* 섹션 헤더 */}
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      자기소개서 목록
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    면접을 진행할 자기소개서를 선택해주세요
                  </p>
                </div>

                {/* 검색 영역 */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="자기소개서 검색..."
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <svg
                          className="h-4 w-4 text-gray-400 hover:text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <p className="mt-2 text-sm text-gray-500">
                      검색 결과: {filteredCoverLetters.length}개
                    </p>
                  )}
                </div>

                {/* 자기소개서 목록 */}
                <div className="h-full space-y-3 overflow-y-auto">
                  {!coverLetters?.content?.length ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 font-medium text-gray-900">
                        작성된 자기소개서가 없습니다
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        먼저 자기소개서를 작성해주세요
                      </p>
                      <Button
                        onClick={() => router.push('/cover-letter')}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        자기소개서 작성하기
                      </Button>
                    </div>
                  ) : filteredCoverLetters.length === 0 ? (
                    <div className="py-12 text-center">
                      <h3 className="mb-2 font-medium text-gray-900">
                        검색 결과가 없습니다
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        다른 키워드로 검색해보세요
                      </p>
                      <Button
                        onClick={() => setSearchTerm('')}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        검색어 초기화
                      </Button>
                    </div>
                  ) : (
                    filteredCoverLetters.map((coverLetter: CoverLetterItem) => (
                      <motion.div
                        key={coverLetter.coverLetterId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                          selectedCoverLetterId === coverLetter.coverLetterId
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                        onClick={() =>
                          handleSelectCoverLetter(coverLetter.coverLetterId)
                        }
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="truncate pr-2 font-semibold text-gray-900">
                            {highlightText(coverLetter.title, searchTerm)}
                          </h3>
                          <span className="flex-shrink-0 text-xs text-gray-400">
                            {new Date(coverLetter.updatedAt).toLocaleDateString(
                              'ko-KR',
                              {
                                month: '2-digit',
                                day: '2-digit',
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {highlightText(coverLetter.jobField, searchTerm)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {coverLetter.experience}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* 오른쪽: 선택된 자기소개서 상세 */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                {!selectedCoverLetterId ? (
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <svg
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        자기소개서를 선택해주세요
                      </h3>
                      <p className="text-gray-600">
                        왼쪽 목록에서 자기소개서를 선택하면
                        <br />
                        상세 내용을 확인할 수 있습니다
                      </p>
                    </div>
                  </div>
                ) : isDetailLoading ? (
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <p className="text-gray-600">
                        자기소개서를 불러오는 중...
                      </p>
                    </div>
                  </div>
                ) : selectedCoverLetter ? (
                  <div className="flex h-full flex-col">
                    {/* 헤더 */}
                    <div className="border-b border-gray-200 p-6">
                      <h2 className="mb-3 text-xl font-bold text-gray-900">
                        {selectedCoverLetter.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">직무분야:</span>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {selectedCoverLetter.jobField}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">경력:</span>
                          <span>{selectedCoverLetter.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">수정일:</span>
                          <span>
                            {new Date(
                              selectedCoverLetter.updatedAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="prose max-w-none">
                        <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                          {selectedCoverLetter.content}
                        </p>
                      </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <Button
                        onClick={handleStartInterview}
                        className="w-full bg-blue-600 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-700"
                      >
                        면접 시작하기
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
