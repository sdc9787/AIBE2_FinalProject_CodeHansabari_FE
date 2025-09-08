'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useModalStore, Button, Input, Textarea } from '@/shared';
import { CoverLetterListModal, useCoverLetterDetail } from '@/entities';
import { useImproveCoverLetterMutation } from '@/features/improve-cover-letter';
import { SaveCoverLetterButton } from '@/features/save-cover-letter';

interface CoverLetterProps {
  id?: number;
}

const MAX_LENGTH = 2000;

export function CoverLetter({ id }: CoverLetterProps) {
  // 상태 관리
  const [currentStep, setCurrentStep] = useState(1);
  const [text, setText] = useState('');
  const [jobField, setJobField] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    feedback: {
      strengths: Array<{ description: string; suggestion: string }>;
      improvements: Array<{ description: string; suggestion: string }>;
      summary: string;
    };
    improvedContent: string;
  } | null>(null);
  const [showNextStep, setShowNextStep] = useState(false);

  const { open } = useModalStore();
  const { data: coverLetterDetail, isLoading } = useCoverLetterDetail(id);
  const improveMutation = useImproveCoverLetterMutation();

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  //id값이 있을때 상세정보 불러와서 폼에 채우기
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

  const handleCustomPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCustomPrompt(e.target.value);
  };

  //저장된 자소서 리스트 모달 열기
  const showResumeModal = () => {
    open(<CoverLetterListModal />);
  };

  const analyzeResume = async () => {
    if (!text.trim()) {
      toast.error('자기소개서를 입력해주세요.');
      return;
    }

    improveMutation.mutate(
      {
        content: text,
        jobField: jobField || '일반',
        experienceYears: parseInt(experienceYears) || 0,
        customPrompt: customPrompt || '일반적인 개선사항을 제안해주세요',
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setAnalysisResult(data.data);
            setShowNextStep(true);
            setCurrentStep(2); // 2단계로 이동
          }
        },
      },
    );
  };

  const clearText = () => {
    setText('');
    setJobField('');
    setExperienceYears('');
    setCustomPrompt('');
    setAnalysisResult(null);
    setShowNextStep(false);
    setCurrentStep(1);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('텍스트가 복사되었습니다.');
    } catch (err) {
      console.error('복사 실패:', err);
      toast.error('텍스트 복사에 실패했습니다.');
    }
  };

  const copyRevisedToInput = () => {
    if (analysisResult?.improvedContent) {
      setText(analysisResult.improvedContent);
      setAnalysisResult(null);
      setShowNextStep(false);
      setCurrentStep(1); // 1단계로 돌아가기
    }
  };

  const goToMockInterview = () => {
    console.log('모의 면접 페이지로 이동');
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
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
    <div className="min-h-screen bg-gradient-to-br to-blue-100 p-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* 스텝 인디케이터 */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 1 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'} font-semibold`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 ${currentStep === 2 ? 'bg-purple-500' : 'bg-gray-300'}`}
            ></div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 2 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'} font-semibold`}
            >
              2
            </div>
          </div>
        </div>

        {/* Step 1: 자기소개서 입력 */}
        {currentStep === 1 && (
          <div>
            {/* 로딩 섹션 */}
            {shouldShowLoading && (
              <div className="mb-8 rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
                <div className="flex h-32 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500"></div>
                  <span className="ml-3 font-medium text-gray-700">
                    자소서를 불러오는 중...
                  </span>
                </div>
              </div>
            )}

            {/* 자기소개서 입력 섹션 */}
            {shouldShowForm && (
              <div className="mb-8 rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                    {title}
                  </h2>
                  <div className="flex gap-3">
                    <Button
                      onClick={showResumeModal}
                      variant="primary"
                      icon={<span>📄</span>}
                      className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
                    >
                      저장된 자소서 불러오기
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">
                      자기소개서 작성
                    </h3>
                    <div className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600">
                      {charCount} / {MAX_LENGTH.toLocaleString()}자
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                      id="jobField"
                      label="직무 분야"
                      value={jobField}
                      onChange={handleJobFieldChange}
                      placeholder="예: 백엔드 개발, 프론트엔드 개발, 마케팅 등"
                      className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Input
                      id="experienceYears"
                      label="경력"
                      value={experienceYears}
                      onChange={handleExperienceYearsChange}
                      placeholder="예: 신입, 1년, 3년, 5년 이상 등"
                      className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <Textarea
                    id="customPrompt"
                    label="AI 첨삭 요청사항 (선택)"
                    value={customPrompt}
                    onChange={handleCustomPromptChange}
                    placeholder="AI에게 특별히 요청하고 싶은 첨삭 방향을 입력해주세요. 예: 신입다운 열정과 학습능력을 강조해주세요"
                    rows={2}
                    className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />

                  <Textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="자기소개서를 입력해주세요. 실시간으로 AI가 분석하고 첨삭해드립니다. (최대 4,000자)"
                    maxLength={MAX_LENGTH}
                    rows={12}
                    className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />

                  <div className="flex gap-4">
                    <Button
                      onClick={analyzeResume}
                      disabled={improveMutation.isPending || !text.trim()}
                      variant="primary"
                      size="lg"
                      loading={improveMutation.isPending}
                      className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
                    >
                      {improveMutation.isPending
                        ? '분석 중...'
                        : 'AI 첨삭 시작'}
                    </Button>
                    <Button
                      onClick={clearText}
                      variant="secondary"
                      icon={<span>🗑️</span>}
                      className="rounded-xl border border-purple-200 bg-white/80 px-6 py-4 font-semibold text-purple-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
                    >
                      전체 삭제
                    </Button>
                    <Button
                      onClick={copyText}
                      variant="secondary"
                      icon={<span>📋</span>}
                      className="rounded-xl border border-purple-200 bg-white/80 px-6 py-4 font-semibold text-purple-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
                    >
                      복사하기
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: AI 첨삭 결과 */}
        {currentStep === 2 && analysisResult && (
          <div>
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <Button
                onClick={goBackToStep1}
                variant="secondary"
                icon={<span>←</span>}
                className="rounded-xl border border-purple-200 bg-white/80 px-4 py-2 font-semibold text-purple-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
              >
                다시 작성하기
              </Button>
            </div>

            {/* AI 모의 면접 권유 섹션 */}
            {showNextStep && (
              <div className="mb-8 rounded-2xl border border-white/20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-8 text-white shadow-xl">
                <div className="flex items-center gap-6">
                  <span className="text-5xl">🎤</span>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold">
                      자기소개서 첨삭이 완료되었습니다!
                    </h3>
                    <p className="mb-6 text-lg text-white/90">
                      이제 완성된 자기소개서를 바탕으로 AI 모의 면접을
                      연습해보세요.
                      <br />
                      실제 면접에서 나올 수 있는 질문들을 미리 경험하고 답변을
                      준비할 수 있습니다.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={goToMockInterview}
                        variant="ghost"
                        size="lg"
                        icon={<span>🤖</span>}
                        className="rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                      >
                        AI 모의 면접 시작하기
                      </Button>
                      <Button
                        onClick={hideNextStepSection}
                        variant="outline"
                        className="rounded-xl border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                      >
                        나중에 하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 분석 결과 섹션 */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* 원본 자기소개서 */}
              <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-800">
                    원본 자기소개서
                  </span>
                  <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                    Original
                  </span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-6">
                  <div className="leading-relaxed whitespace-pre-wrap text-gray-700">
                    {text}
                  </div>
                </div>
              </div>

              {/* 수정된 자기소개서 */}
              <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-800">
                      AI 첨삭 결과
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white">
                      Revised
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={copyRevisedToInput}
                      variant="small"
                      size="sm"
                      icon={<span>📝</span>}
                      className="rounded-lg bg-purple-100 px-4 py-2 font-medium text-purple-700 transition-all duration-200 hover:bg-purple-200"
                    >
                      편집창으로 복사
                    </Button>
                    <SaveCoverLetterButton
                      data={{
                        title: title,
                        content: analysisResult.improvedContent,
                        jobField: jobField || '일반',
                        experienceYears: parseInt(experienceYears) || 0,
                        isAiImproved: true,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                  <div className="leading-relaxed whitespace-pre-wrap text-gray-700">
                    {analysisResult.improvedContent}
                  </div>
                </div>
              </div>

              {/* AI 피드백 */}
              <div className="col-span-2 rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-6">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                    🤖 AI 피드백
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  {/* 강점 */}
                  {analysisResult.feedback.strengths.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-green-600">
                        <span>✅</span> 잘한 부분
                      </h4>
                      {analysisResult.feedback.strengths.map(
                        (strength, index) => (
                          <div
                            key={index}
                            className="mb-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4"
                          >
                            <p className="mb-2 font-semibold text-green-800">
                              {strength.description}
                            </p>
                            <p className="text-sm leading-relaxed text-green-700">
                              {strength.suggestion}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  {/* 개선사항 */}
                  {analysisResult.feedback.improvements.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-orange-600">
                        <span>⚠️</span> 개선할 부분
                      </h4>
                      {analysisResult.feedback.improvements.map(
                        (improvement, index) => (
                          <div
                            key={index}
                            className="mb-4 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4"
                          >
                            <p className="mb-2 font-semibold text-orange-800">
                              {improvement.description}
                            </p>
                            <p className="text-sm leading-relaxed text-orange-700">
                              {improvement.suggestion}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  {/* 요약 */}
                  <div className="col-span-2">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-600">
                      <span>📝</span> 종합 의견
                    </h4>
                    <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                      <p className="text-base leading-relaxed text-blue-800">
                        {analysisResult.feedback.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
