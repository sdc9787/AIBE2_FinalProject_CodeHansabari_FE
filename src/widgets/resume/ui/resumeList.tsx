'use client';
import { useState } from 'react';
import { Button } from '@/shared';
import { useResumeList } from '@/entities/resume';
import { deleteResume } from '@/entities/resume';
import toast from 'react-hot-toast';

interface ResumeListProps {
  onCreateNew: () => void;
  onEdit: (resumeId: number) => void;
}

export function ResumeList({ onCreateNew, onEdit }: ResumeListProps) {
  const { data: resumeListData, isLoading, refetch } = useResumeList();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (resumeId: number) => {
    if (!confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
      return;
    }

    setDeletingId(resumeId);
    try {
      await deleteResume(resumeId);
      toast.success('이력서가 삭제되었습니다.');
      refetch();
    } catch (error) {
      toast.error('이력서 삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-6 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500"></div>
              <span className="ml-3 font-medium text-gray-700">
                이력서 목록을 불러오는 중...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const resumes = resumeListData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
              내 이력서
            </h1>
            <Button
              onClick={onCreateNew}
              variant="primary"
              icon={<span>➕</span>}
              className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
            >
              새 이력서 작성
            </Button>
          </div>
        </div>

        {/* 이력서 목록 */}
        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-white/20 bg-white/95 p-12 text-center shadow-xl backdrop-blur-sm">
            <div className="mb-6">
              <span className="text-6xl">📄</span>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              아직 작성된 이력서가 없습니다
            </h2>
            <p className="mb-6 text-gray-600">
              첫 번째 이력서를 작성해보세요. AI가 도와드릴게요!
            </p>
            <Button
              onClick={onCreateNew}
              variant="primary"
              icon={<span>✨</span>}
              className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
            >
              이력서 작성 시작하기
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 hover:shadow-2xl"
              >
                <div className="mb-4">
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800">
                    {resume.title}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">{resume.memberInfo.name}</p>
                    <p className="text-xs text-gray-500">
                      생성일: {formatDate(resume.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      수정일: {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500">
                    섹션 {resume.sections.length}개
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {resume.sections.slice(0, 3).map((section, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-600"
                      >
                        {section.sectionTitle}
                      </span>
                    ))}
                    {resume.sections.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                        +{resume.sections.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onEdit(resume.id)}
                    variant="primary"
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-purple-600 hover:to-blue-600"
                  >
                    편집
                  </Button>
                  <Button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    variant="secondary"
                    icon={
                      deletingId === resume.id ? (
                        <span>⏳</span>
                      ) : (
                        <span>🗑️</span>
                      )
                    }
                    className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 transition-all duration-200 hover:bg-red-50"
                  >
                    {deletingId === resume.id ? '삭제 중...' : '삭제'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
