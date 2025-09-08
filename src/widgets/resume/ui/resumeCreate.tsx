'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button, Textarea } from '@/shared';
import { MemberInfo, ResumeSection } from '@/entities/resume';
import { useCreateResumeMutation } from '@/features/create-resume';
import { useAISuggestMutation } from '@/features/ai-suggest-resume';
import { ResumeSidebar } from './resumeSidebar';
import { ResumeDocument } from './resumeDocument';

export function ResumeCreate() {
  const router = useRouter();
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

  const createResumeMutation = useCreateResumeMutation();
  const aiSuggestMutation = useAISuggestMutation();

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('이력서 제목을 입력해주세요.');
      return;
    }

    if (!memberInfo.name.trim() || !memberInfo.email.trim()) {
      toast.error('이름과 이메일은 필수 입력 항목입니다.');
      return;
    }

    try {
      await createResumeMutation.mutateAsync({
        title,
        memberInfo,
        sections,
      });

      toast.success('이력서가 생성되었습니다.');
      router.push('/resume');
    } catch (error) {
      toast.error('이력서 생성에 실패했습니다.');
    }
  };

  const handleAISuggest = async () => {
    if (!experienceContent.trim()) {
      toast.error('경험 내용을 입력해주세요.');
      return;
    }

    try {
      const result = await aiSuggestMutation.mutateAsync({
        experienceContent,
      });

      if (result.data) {
        setSections(result.data.suggestedSections);
        setShowAISuggest(false);
        toast.success('AI 제안이 적용되었습니다.');
      }
    } catch (error) {
      toast.error('AI 제안 생성에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 왼쪽 사이드바 */}
      <ResumeSidebar
        sections={sections}
        onSectionsChange={setSections}
        onSave={handleSave}
        onAISuggest={() => setShowAISuggest(true)}
        isLoading={createResumeMutation.isPending}
      />

      {/* 오른쪽 메인 영역 */}
      <div className="ml-64 p-8">
        <div className="mx-auto max-w-4xl">
          {/* 상단 버튼들 */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                새 이력서 작성
              </h1>
              <p className="text-sm text-gray-600">
                왼쪽 패널에서 정보를 입력하면 실시간으로 미리보기가
                업데이트됩니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/resume')}
                variant="secondary"
                className="px-4 py-2"
              >
                목록으로
              </Button>
            </div>
          </div>

          {/* 이력서 문서 */}
          <div className="rounded-lg bg-gray-100 p-8 shadow-inner">
            <ResumeDocument
              title={title}
              memberInfo={memberInfo}
              sections={sections}
              onTitleChange={setTitle}
              onMemberInfoChange={setMemberInfo}
              onSectionsChange={setSections}
              isEditable={true}
            />
          </div>
        </div>
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
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                ✕
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
                    aiSuggestMutation.isPending || !experienceContent.trim()
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
    </div>
  );
}
