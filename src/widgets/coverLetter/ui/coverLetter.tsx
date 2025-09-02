'use client';
import { useState, useEffect } from 'react';
import { useModalStore } from '@/shared';
import { CoverLetterListModal, useCoverLetterDetail } from '@/entities';

interface CoverLetterProps {
  id?: number;
}

export function CoverLetter({ id }: CoverLetterProps) {
  const [text, setText] = useState('');
  const [jobField, setJobField] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    original: string;
    revised: string;
  } | null>(null);
  const [showNextStep, setShowNextStep] = useState(false);

  const { open } = useModalStore();
  const maxLength = 2000;

  // id가 있을 때만 자소서 상세 데이터를 불러옴
  const { data: coverLetterDetail, isLoading } = useCoverLetterDetail(id);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // 자소서 상세 데이터가 로드되면 텍스트에 설정
  useEffect(() => {
    if (coverLetterDetail && id) {
      setText(coverLetterDetail.content);
      setJobField(coverLetterDetail.jobField);
      setExperienceYears(coverLetterDetail.experience);
    }
  }, [coverLetterDetail, id]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleJobFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobField(e.target.value);
  };

  const handleExperienceYearsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setExperienceYears(e.target.value);
  };

  const showResumeModal = () => {
    open(<CoverLetterListModal />);
  };

  const analyzeResume = async () => {
    if (!text.trim()) {
      alert('자기소개서를 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);

    // TODO: API 호출 로직 구현
    // 임시로 시뮬레이션
    setTimeout(() => {
      setAnalysisResult({
        original: text,
        revised: text + ' (AI 첨삭 결과 예시)',
      });
      setIsAnalyzing(false);
      setShowNextStep(true);
    }, 2000);
  };

  const clearText = () => {
    setText('');
    setJobField('');
    setExperienceYears('');
    setAnalysisResult(null);
    setShowNextStep(false);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('텍스트가 복사되었습니다.');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const copyRevisedToInput = () => {
    if (analysisResult?.revised) {
      setText(analysisResult.revised);
      setAnalysisResult(null);
      setShowNextStep(false);
    }
  };

  const goToMockInterview = () => {
    // TODO: 모의 면접 페이지로 이동
    console.log('모의 면접 페이지로 이동');
  };

  const hideNextStepSection = () => {
    setShowNextStep(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* 로딩 상태 */}
        {id && isLoading && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">
                자소서를 불러오는 중...
              </span>
            </div>
          </div>
        )}
        {/* 자기소개서 입력 섹션 */}
        {(!id || !isLoading) && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {id && coverLetterDetail
                  ? coverLetterDetail.title
                  : 'AI 자기소개서 첨삭'}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={showResumeModal}
                  className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  📄 저장된 자소서 불러오기
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">
                  자기소개서 작성
                </h3>
                <div className="text-sm text-gray-500">
                  {charCount} / {maxLength.toLocaleString()}자
                </div>
              </div>

              {/* 직무 분야와 경력 입력 필드 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="jobField"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    직무 분야
                  </label>
                  <input
                    id="jobField"
                    type="text"
                    value={jobField}
                    onChange={handleJobFieldChange}
                    className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="예: 백엔드 개발, 프론트엔드 개발, 마케팅 등"
                  />
                </div>
                <div>
                  <label
                    htmlFor="experienceYears"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    경력
                  </label>
                  <input
                    id="experienceYears"
                    type="text"
                    value={experienceYears}
                    onChange={handleExperienceYearsChange}
                    className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="예: 신입, 1년, 3년, 5년 이상 등"
                  />
                </div>
              </div>

              <textarea
                value={text}
                onChange={handleTextChange}
                className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="자기소개서를 입력해주세요. 실시간으로 AI가 분석하고 첨삭해드립니다. (최대 4,000자)"
                maxLength={maxLength}
                rows={12}
              />

              <div className="flex gap-3">
                <button
                  onClick={analyzeResume}
                  disabled={isAnalyzing || !text.trim()}
                  className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isAnalyzing ? '분석 중...' : 'AI 첨삭 시작'}
                </button>
                <button
                  onClick={clearText}
                  className="flex items-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  🗑️ 전체 삭제
                </button>
                <button
                  onClick={copyText}
                  className="flex items-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  📋 복사하기
                </button>
              </div>
            </div>
          </div>
        )}{' '}
        {/* AI 모의 면접 권유 섹션 */}
        {showNextStep && (
          <div className="animate-fade-in mb-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white shadow-md">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎤</span>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold">
                  자기소개서 첨삭이 완료되었습니다!
                </h3>
                <p className="mb-4 text-green-100">
                  이제 완성된 자기소개서를 바탕으로 AI 모의 면접을 연습해보세요.
                  <br />
                  실제 면접에서 나올 수 있는 질문들을 미리 경험하고 답변을
                  준비할 수 있습니다.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={goToMockInterview}
                    className="rounded-md bg-white px-6 py-2 text-blue-600 hover:bg-gray-100"
                  >
                    🤖 AI 모의 면접 시작하기
                  </button>
                  <button
                    onClick={hideNextStepSection}
                    className="rounded-md border border-white bg-transparent px-4 py-2 text-white hover:bg-white hover:text-blue-600"
                  >
                    나중에 하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 분석 결과 섹션 */}
        {analysisResult && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* 원본 자기소개서 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">
                  원본 자기소개서
                </span>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-600">
                  Original
                </span>
              </div>
              <div className="rounded-md bg-gray-50 p-4">
                <div className="whitespace-pre-wrap text-gray-700">
                  {analysisResult.original}
                </div>
              </div>
            </div>

            {/* 수정된 자기소개서 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-700">
                    AI 첨삭 결과
                  </span>
                  <span className="rounded-full bg-blue-200 px-3 py-1 text-sm text-blue-600">
                    Revised
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyRevisedToInput}
                    className="rounded-md bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                  >
                    📝 편집창으로 복사
                  </button>
                  <button className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
                    💾 저장하기
                  </button>
                </div>
              </div>
              <div className="rounded-md bg-blue-50 p-4">
                <div className="whitespace-pre-wrap text-gray-700">
                  {analysisResult.revised}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
