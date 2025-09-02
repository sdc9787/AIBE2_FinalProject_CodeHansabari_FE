'use client';
import { useState, useEffect } from 'react';
import { useModalStore, Button, Input, Textarea } from '@/shared';
import { CoverLetterListModal, useCoverLetterDetail } from '@/entities';

interface CoverLetterProps {
  id?: number;
}

const MAX_LENGTH = 2000;

export function CoverLetter({ id }: CoverLetterProps) {
  // 상태 관리
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
  const { data: coverLetterDetail, isLoading } = useCoverLetterDetail(id);

  // Effects
  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  useEffect(() => {
    if (coverLetterDetail && id) {
      setText(coverLetterDetail.content);
      setJobField(coverLetterDetail.jobField);
      setExperienceYears(coverLetterDetail.experience);
    }
  }, [coverLetterDetail, id]);

  // 핸들러들
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
    console.log('모의 면접 페이지로 이동');
  };

  const hideNextStepSection = () => {
    setShowNextStep(false);
  };

  // 조건부 렌더링 변수들
  const shouldShowLoading = id && isLoading;
  const shouldShowForm = !id || !isLoading;
  const title =
    id && coverLetterDetail ? coverLetterDetail.title : 'AI 자기소개서 첨삭';

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* 로딩 섹션 */}
        {shouldShowLoading && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 rounded-full border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">
                자소서를 불러오는 중...
              </span>
            </div>
          </div>
        )}

        {/* 자기소개서 입력 섹션 */}
        {shouldShowForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <div className="flex gap-3">
                <Button
                  onClick={showResumeModal}
                  variant="primary"
                  icon={<span>📄</span>}
                >
                  저장된 자소서 불러오기
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">
                  자기소개서 작성
                </h3>
                <div className="text-sm text-gray-500">
                  {charCount} / {MAX_LENGTH.toLocaleString()}자
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  id="jobField"
                  label="직무 분야"
                  value={jobField}
                  onChange={handleJobFieldChange}
                  placeholder="예: 백엔드 개발, 프론트엔드 개발, 마케팅 등"
                />
                <Input
                  id="experienceYears"
                  label="경력"
                  value={experienceYears}
                  onChange={handleExperienceYearsChange}
                  placeholder="예: 신입, 1년, 3년, 5년 이상 등"
                />
              </div>

              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="자기소개서를 입력해주세요. 실시간으로 AI가 분석하고 첨삭해드립니다. (최대 4,000자)"
                maxLength={MAX_LENGTH}
                rows={12}
              />

              <div className="flex gap-3">
                <Button
                  onClick={analyzeResume}
                  disabled={isAnalyzing || !text.trim()}
                  variant="primary"
                  size="lg"
                  loading={isAnalyzing}
                >
                  {isAnalyzing ? '분석 중...' : 'AI 첨삭 시작'}
                </Button>
                <Button
                  onClick={clearText}
                  variant="secondary"
                  icon={<span>🗑️</span>}
                >
                  전체 삭제
                </Button>
                <Button
                  onClick={copyText}
                  variant="secondary"
                  icon={<span>📋</span>}
                >
                  복사하기
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AI 모의 면접 권유 섹션 */}
        {showNextStep && (
          <div className="mb-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white shadow-md">
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
                  <Button
                    onClick={goToMockInterview}
                    variant="ghost"
                    size="lg"
                    icon={<span>🤖</span>}
                  >
                    AI 모의 면접 시작하기
                  </Button>
                  <Button onClick={hideNextStepSection} variant="outline">
                    나중에 하기
                  </Button>
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
                  <Button
                    onClick={copyRevisedToInput}
                    variant="small"
                    size="sm"
                    icon={<span>📝</span>}
                  >
                    편집창으로 복사
                  </Button>
                  <Button variant="primary" size="sm" icon={<span>💾</span>}>
                    저장하기
                  </Button>
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
    </div>
  );
}
