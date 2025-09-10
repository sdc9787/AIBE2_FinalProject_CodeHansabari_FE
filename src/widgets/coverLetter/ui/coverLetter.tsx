'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useModalStore, Button, Textarea } from '@/shared';
import { CoverLetterListModal, useCoverLetterDetail } from '@/entities';
import { useImproveCoverLetterMutation } from '@/features/improve-cover-letter';
import { SaveCoverLetterButton } from '@/features/save-cover-letter';

interface CoverLetterProps {
  id?: number;
}

const MAX_LENGTH = 2000;

// IT 직종 목록
const IT_JOB_FIELDS = [
  '프론트엔드 개발자',
  '백엔드 개발자',
  '풀스택 개발자',
  '모바일 앱 개발자',
  '게임 개발자',
  '데이터 사이언티스트',
  '데이터 엔지니어',
  '머신러닝 엔지니어',
  'AI 엔지니어',
  'DevOps 엔지니어',
  '시스템 엔지니어',
  '네트워크 엔지니어',
  '보안 엔지니어',
  '클라우드 엔지니어',
  'QA 엔지니어',
  'UI/UX 디자이너',
  '프로덕트 매니저',
  '프로젝트 매니저',
  'IT 컨설턴트',
  '기술 영업',
  '기타',
];

// 경력 선택지
const EXPERIENCE_OPTIONS = [
  '신입',
  '1년',
  '2년',
  '3년',
  '4년',
  '5년',
  '6년',
  '7년',
  '8년',
  '9년',
  '10년 이상',
];

export function CoverLetter({ id }: CoverLetterProps) {
  // 상태 관리
  const [currentStep, setCurrentStep] = useState(1);
  const [text, setText] = useState('');
  const [jobField, setJobField] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [charCount, setCharCount] = useState(0);

  // 셀렉트 관련 상태
  const [isJobFieldOpen, setIsJobFieldOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [jobFieldSearch, setJobFieldSearch] = useState('');

  // 필터된 직종 목록
  const filteredJobFields = IT_JOB_FIELDS.filter((job) =>
    job.toLowerCase().includes(jobFieldSearch.toLowerCase()),
  );
  const [analysisResult, setAnalysisResult] = useState<{
    feedback: {
      strengths: Array<{ description: string; suggestion: string }>;
      improvements: Array<{ description: string; suggestion: string }>;
      summary: string;
    };
    improvedContent: string;
  } | null>(null);

  const { open } = useModalStore();
  const { data: coverLetterDetail, isLoading } = useCoverLetterDetail(id);
  const improveMutation = useImproveCoverLetterMutation();

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // 외부 클릭으로 셀렉트 박스 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // 클릭된 요소가 셀렉트 박스 내부인지 확인
      const isJobFieldClick = target.closest('[data-select="job-field"]');
      const isExperienceClick = target.closest('[data-select="experience"]');

      if (!isJobFieldClick) {
        setIsJobFieldOpen(false);
      }
      if (!isExperienceClick) {
        setIsExperienceOpen(false);
      }
    };

    if (isJobFieldOpen || isExperienceOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isJobFieldOpen, isExperienceOpen]);

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

  const handleJobFieldSelect = (job: string) => {
    setJobField(job);
    setIsJobFieldOpen(false);
    setJobFieldSearch('');
  };

  const handleExperienceSelect = (experience: string) => {
    setExperienceYears(experience);
    setIsExperienceOpen(false);
  };

  const handleJobFieldSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setJobFieldSearch(e.target.value);
  };

  const handleSearchInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleJobFieldToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJobFieldOpen(!isJobFieldOpen);
    setIsExperienceOpen(false);
  };

  const handleExperienceToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExperienceOpen(!isExperienceOpen);
    setIsJobFieldOpen(false);
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
    if (!jobField) {
      toast.error('직무를 선택해주세요.');
      return;
    }

    if (!experienceYears) {
      toast.error('경력을 선택해주세요.');
      return;
    }

    if (!text.trim()) {
      toast.error('자기소개서를 입력해주세요.');
      return;
    }

    // Step 1에서는 기본 프롬프트, Step 2에서는 커스텀 프롬프트 사용
    const promptToUse =
      currentStep === 1
        ? ''
        : customPrompt || '일반적인 개선사항을 제안해주세요';

    // Step 2에서는 AI 첨삭 완료된 자기소개서를 보내고, Step 1에서는 원본을 보냄
    const contentToSend =
      currentStep === 2 && analysisResult?.improvedContent
        ? analysisResult.improvedContent
        : text;

    improveMutation.mutate(
      {
        content: contentToSend,
        jobField: jobField || '일반',
        experienceYears: parseInt(experienceYears) || 0,
        customPrompt: promptToUse,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setAnalysisResult(data.data);
            if (currentStep === 1) {
              setCurrentStep(2); // 첫 분석 후 2단계로 이동
            }
          }
        },
      },
    );
  };

  const copyRevisedToInput = () => {
    if (analysisResult?.improvedContent) {
      setText(analysisResult.improvedContent);
      setAnalysisResult(null);
      setCustomPrompt(''); // 편집창으로 복사할 때 커스텀 프롬프트 초기화
      setCurrentStep(1); // 1단계로 돌아가기
    }
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
    setCustomPrompt(''); // Step 1로 돌아갈 때 커스텀 프롬프트 초기화
  };

  // 조건부 렌더링 변수들
  const shouldShowLoading = id && isLoading;
  const shouldShowForm = !id || !isLoading;
  const title =
    id && coverLetterDetail ? coverLetterDetail.title : 'AI 자기소개서 첨삭';

  return (
    <div className="">
      <div className="mx-auto mb-20 flex max-w-7xl gap-8">
        {/* 좌측 스텝 인디케이터 */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-30 z-10">
            <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-bold text-gray-800">
                진행 단계
              </h3>
              <div className="space-y-4">
                {/* Step 1 */}
                <motion.div
                  className={`flex items-center gap-4 rounded-lg p-4 transition-all duration-300 ${
                    currentStep === 1
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  animate={currentStep === 1 ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      currentStep === 1 ? 'bg-white/20' : 'bg-white'
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <div className="font-semibold">자소서 작성</div>
                    <div
                      className={`text-xs ${currentStep === 1 ? 'text-white/80' : 'text-gray-500'}`}
                    >
                      자기소개서 입력 및 설정
                    </div>
                  </div>
                </motion.div>

                {/* 연결선 */}
                <div className="flex justify-center">
                  <motion.div
                    className={`h-8 w-0.5 ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}
                    animate={
                      currentStep === 2 ? { scaleY: 1 } : { scaleY: 0.5 }
                    }
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Step 2 */}
                <motion.div
                  className={`flex items-center gap-4 rounded-lg p-4 transition-all duration-300 ${
                    currentStep === 2
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  animate={currentStep === 2 ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      currentStep === 2 ? 'bg-white/20' : 'bg-white'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <div className="font-semibold">AI 첨삭 결과</div>
                    <div
                      className={`text-xs ${currentStep === 2 ? 'text-white/80' : 'text-gray-500'}`}
                    >
                      피드백 및 개선된 자소서
                    </div>
                  </div>
                </motion.div>

                {/* 뒤로가기 버튼 - Step 2일 때만 표시 */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="mt-6 border-t border-gray-200 pt-4"
                  >
                    <Button
                      onClick={goBackToStep1}
                      variant="secondary"
                      icon={<span>←</span>}
                      className="w-full justify-center rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-md active:scale-[0.98]"
                    >
                      다시 작성하기
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 우측 메인 콘텐츠 */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1: 자기소개서 입력 */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* 로딩 섹션 */}
                {shouldShowLoading && (
                  <div className="mb-8 rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
                    <div className="flex h-32 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
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
                      <h2 className="text-3xl font-bold text-gray-800">
                        {title}
                      </h2>
                      <div className="flex gap-3">
                        <Button
                          onClick={showResumeModal}
                          variant="primary"
                          className="transform rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700"
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
                        <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                          {charCount} / {MAX_LENGTH.toLocaleString()}자
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* 직무 분야 셀렉트 */}
                        <div className="relative" data-select="job-field">
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            직무 분야
                          </label>
                          <div className="relative">
                            <motion.button
                              type="button"
                              onClick={handleJobFieldToggle}
                              className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-left text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <span
                                className={
                                  jobField ? 'text-gray-900' : 'text-gray-500'
                                }
                              >
                                {jobField || '직무를 선택해주세요'}
                              </span>
                              <motion.span
                                className="absolute right-3 text-gray-400"
                                animate={{ rotate: isJobFieldOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                ▼
                              </motion.span>
                            </motion.button>

                            <AnimatePresence>
                              {isJobFieldOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{
                                    duration: 0.15,
                                    ease: 'easeOut',
                                  }}
                                  className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl"
                                >
                                  <div className="p-3">
                                    <input
                                      type="text"
                                      placeholder="직무 검색..."
                                      value={jobFieldSearch}
                                      onChange={handleJobFieldSearchChange}
                                      onClick={handleSearchInputClick}
                                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                    />
                                  </div>
                                  <div className="max-h-60 overflow-x-hidden overflow-y-auto">
                                    {filteredJobFields.map((job, index) => (
                                      <button
                                        key={job}
                                        type="button"
                                        onClick={() =>
                                          handleJobFieldSelect(job)
                                        }
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-150 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700"
                                        style={{
                                          animationDelay: `${index * 20}ms`,
                                        }}
                                      >
                                        {job}
                                      </button>
                                    ))}
                                    {filteredJobFields.length === 0 && (
                                      <div className="px-4 py-3 text-sm text-gray-500">
                                        검색 결과가 없습니다.
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* 경력 셀렉트 */}
                        <div className="relative" data-select="experience">
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            경력
                          </label>
                          <div className="relative">
                            <motion.button
                              type="button"
                              onClick={handleExperienceToggle}
                              className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-left text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <span
                                className={
                                  experienceYears
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                                }
                              >
                                {experienceYears || '경력을 선택해주세요'}
                              </span>
                              <motion.span
                                className="absolute right-3 text-gray-400"
                                animate={{ rotate: isExperienceOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                ▼
                              </motion.span>
                            </motion.button>

                            <AnimatePresence>
                              {isExperienceOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{
                                    duration: 0.15,
                                    ease: 'easeOut',
                                  }}
                                  className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl"
                                >
                                  <div className="max-h-60 overflow-x-hidden overflow-y-auto">
                                    {EXPERIENCE_OPTIONS.map(
                                      (experience, index) => (
                                        <button
                                          key={experience}
                                          type="button"
                                          onClick={() =>
                                            handleExperienceSelect(experience)
                                          }
                                          className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-150 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700"
                                          style={{
                                            animationDelay: `${index * 30}ms`,
                                          }}
                                        >
                                          {experience}
                                        </button>
                                      ),
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      <Textarea
                        value={text}
                        onChange={handleTextChange}
                        placeholder="자기소개서를 입력해주세요. 실시간으로 AI가 분석하고 첨삭해드립니다. (최대 4,000자)"
                        maxLength={MAX_LENGTH}
                        rows={12}
                        className="rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />

                      <div className="flex gap-4">
                        <Button
                          onClick={analyzeResume}
                          disabled={improveMutation.isPending || !text.trim()}
                          variant="primary"
                          size="md"
                          loading={improveMutation.isPending}
                          className="transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700"
                        >
                          {improveMutation.isPending
                            ? '분석 중...'
                            : 'AI 첨삭 시작'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: AI 첨삭 결과 */}
            {currentStep === 2 && analysisResult && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  {/* 분석 결과 섹션 */}
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* 원본 자기소개서 */}
                    <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="h-[40px] text-xl font-bold text-gray-800">
                          원본 자기소개서
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
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={copyRevisedToInput}
                            variant="small"
                            size="sm"
                            className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 transition-all duration-200 hover:bg-blue-200"
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
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <div className="leading-relaxed whitespace-pre-wrap text-gray-700">
                          {analysisResult.improvedContent}
                        </div>
                      </div>
                    </div>
                    {/* 추가 개선 요청 섹션 */}
                    <div className="col-span-2 mb-8 rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
                      <h3 className="mb-4 text-lg font-bold text-gray-800">
                        추가 개선 요청
                      </h3>
                      <div className="space-y-4">
                        <Textarea
                          id="customPrompt"
                          label="AI 첨삭 요청사항"
                          value={customPrompt}
                          onChange={handleCustomPromptChange}
                          placeholder="현재 결과에서 추가로 개선하고 싶은 부분이 있다면 입력해주세요. 예: 신입다운 열정과 학습능력을 더 강조해주세요"
                          rows={3}
                          className="rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex gap-3">
                          <Button
                            onClick={analyzeResume}
                            disabled={improveMutation.isPending || !text.trim()}
                            variant="primary"
                            loading={improveMutation.isPending}
                            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
                          >
                            {improveMutation.isPending
                              ? '재분석 중...'
                              : '추가 개선하기'}
                          </Button>
                          <Button
                            onClick={() => setCustomPrompt('')}
                            variant="secondary"
                            className="rounded-xl border border-blue-200 bg-white/80 px-6 py-3 font-semibold text-blue-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
                          >
                            요청사항 초기화
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* AI 피드백 */}
                    <div className="col-span-2 rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
                      <div className="mb-6">
                        <span className="text-2xl font-bold text-green-600">
                          AI 피드백
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-7">
                        {/* 강점 */}
                        {analysisResult.feedback.strengths.length > 0 && (
                          <div className="">
                            <h4 className="flex items-center gap-2 text-lg font-bold text-green-600">
                              <span>✅</span> 잘한 부분
                            </h4>
                            {analysisResult.feedback.strengths.map(
                              (strength, index) => (
                                <div
                                  key={index}
                                  className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4"
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
                          <div className="">
                            <h4 className="flex items-center gap-2 text-lg font-bold text-orange-600">
                              <span>⚠️</span> 개선할 부분
                            </h4>
                            {analysisResult.feedback.improvements.map(
                              (improvement, index) => (
                                <div
                                  key={index}
                                  className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4"
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
                          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                            <p className="text-base leading-relaxed text-blue-800">
                              {analysisResult.feedback.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
