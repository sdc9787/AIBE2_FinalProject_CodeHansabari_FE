'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Input, Textarea } from '@/shared';
import { MemberInfo, ResumeSection, useResumeDetail } from '@/entities/resume';
import { useCreateResumeMutation } from '@/features/create-resume';
import { useAISuggestMutation } from '@/features/ai-suggest-resume';
import { ResumeForm } from './resumeForm';
import { ResumePreview } from './resumePreview';

interface ResumeProps {
  id?: number;
}

export function Resume({ id }: ResumeProps) {
  const [title, setTitle] = useState('');
  const [memberInfo, setMemberInfo] = useState<MemberInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    blogUrl: '',
  });
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [experienceContent, setExperienceContent] = useState('');
  const [showAISuggest, setShowAISuggest] = useState(false);

  const { data: resumeDetail, isLoading } = useResumeDetail(id);
  const createResumeMutation = useCreateResumeMutation();
  const aiSuggestMutation = useAISuggestMutation();

  // ID가 있을 때 상세 정보 불러와서 폼에 채우기
  useEffect(() => {
    if (resumeDetail?.data && id) {
      setTitle(resumeDetail.data.title);
      setMemberInfo(resumeDetail.data.memberInfo);
      setSections(resumeDetail.data.sections);
    }
  }, [resumeDetail, id]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('이력서 제목을 입력해주세요.');
      return;
    }

    if (!memberInfo.name.trim() || !memberInfo.email.trim()) {
      toast.error('이름과 이메일은 필수 입력 항목입니다.');
      return;
    }

    createResumeMutation.mutate(
      {
        title,
        memberInfo,
        sections,
      },
      {
        onSuccess: () => {
          toast.success('이력서가 성공적으로 저장되었습니다.');
        },
        onError: () => {
          toast.error('이력서 저장에 실패했습니다.');
        },
      },
    );
  };

  const handleAISuggest = async () => {
    if (!experienceContent.trim()) {
      toast.error('경험 내용을 입력해주세요.');
      return;
    }

    aiSuggestMutation.mutate(
      { experienceContent },
      {
        onSuccess: (data) => {
          if (data.success) {
            setSections([...sections, ...data.data.suggestedSections]);
            setShowAISuggest(false);
            setExperienceContent('');
            toast.success('AI 제안이 이력서에 추가되었습니다.');
          }
        },
        onError: () => {
          toast.error('AI 제안을 받는데 실패했습니다.');
        },
      },
    );
  };

  const shouldShowLoading = id && isLoading;
  const shouldShowForm = !id || !isLoading;
  const pageTitle =
    id && resumeDetail?.data ? resumeDetail.data.title : '이력서 작성';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* 로딩 섹션 */}
        {shouldShowLoading && (
          <div className="mb-8 rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500"></div>
              <span className="ml-3 font-medium text-gray-700">
                이력서를 불러오는 중...
              </span>
            </div>
          </div>
        )}

        {/* 메인 컨텐츠 */}
        {shouldShowForm && (
          <>
            {/* 헤더 */}
            <div className="mb-8 rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                  {pageTitle}
                </h1>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowAISuggest(true)}
                    variant="secondary"
                    icon={<span>🤖</span>}
                    className="rounded-xl border border-purple-200 bg-white/80 px-6 py-3 font-semibold text-purple-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
                  >
                    AI 제안받기
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={createResumeMutation.isPending}
                    variant="primary"
                    loading={createResumeMutation.isPending}
                    className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
                  >
                    {createResumeMutation.isPending ? '저장 중...' : '저장하기'}
                  </Button>
                </div>
              </div>

              <Input
                id="title"
                label="이력서 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 신입 백엔드 개발자 이력서"
                className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* AI 제안 모달 */}
            {showAISuggest && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white p-8 shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      AI 이력서 제안
                    </h2>
                    <Button
                      onClick={() => setShowAISuggest(false)}
                      variant="secondary"
                      icon={<span>✕</span>}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      닫기
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Textarea
                      value={experienceContent}
                      onChange={(e) => setExperienceContent(e.target.value)}
                      placeholder="경험이나 기술, 프로젝트 등에 대해 자유롭게 작성해주세요. AI가 이를 바탕으로 이력서 항목을 제안해드립니다."
                      rows={6}
                      className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAISuggest}
                        disabled={
                          aiSuggestMutation.isPending ||
                          !experienceContent.trim()
                        }
                        variant="primary"
                        loading={aiSuggestMutation.isPending}
                        className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
                      >
                        {aiSuggestMutation.isPending
                          ? 'AI 분석 중...'
                          : 'AI 제안받기'}
                      </Button>
                      <Button
                        onClick={() => setShowAISuggest(false)}
                        variant="secondary"
                        className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-600 shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 메인 컨텐츠 영역 */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* 왼쪽: 이력서 작성 폼 */}
              <div className="space-y-6">
                <ResumeForm
                  memberInfo={memberInfo}
                  sections={sections}
                  onMemberInfoChange={setMemberInfo}
                  onSectionsChange={setSections}
                />
              </div>

              {/* 오른쪽: 이력서 미리보기 */}
              <div className="sticky top-8">
                <div className="mb-4 text-center">
                  <h2 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
                    미리보기
                  </h2>
                </div>
                <ResumePreview memberInfo={memberInfo} sections={sections} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
