'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeList } from '@/entities';
import { Button } from '@/shared';

export function ResumeList() {
  const router = useRouter();
  const { data: resumeListData, isLoading, error } = useResumeList();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const resumes = resumeListData?.content || [];

  const handleResumeEdit = (resumeId: number) => {
    router.push(`/resume/edit/${resumeId}`);
  };

  const handleCreateNew = () => {
    router.push('/resume/create');
  };

  const handleMenuToggle = (resumeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === resumeId ? null : resumeId);
  };

  const handleDownload = (resumeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: 다운로드 로직 구현
    console.log('다운로드:', resumeId);
    setOpenMenuId(null);
  };

  const handleDelete = (resumeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: 삭제 로직 구현
    if (confirm('정말 이 이력서를 삭제하시겠습니까?')) {
      console.log('삭제:', resumeId);
    }
    setOpenMenuId(null);
  };

  // 외부 클릭 이벤트 리스너
  useEffect(() => {
    const handleDocumentClick = () => {
      setOpenMenuId(null);
    };

    if (openMenuId !== null) {
      document.addEventListener('click', handleDocumentClick);
      return () => document.removeEventListener('click', handleDocumentClick);
    }
  }, [openMenuId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="flex h-32 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-8 w-8 rounded-full border-b-2 border-blue-500"
            />
            <span className="ml-3 font-medium text-gray-700">
              이력서 목록을 불러오는 중...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="py-8 text-center">
            <p className="text-red-500">
              이력서 목록을 불러오는데 실패했습니다.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              className="mt-4 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
            >
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center justify-between"
        >
          <h2 className="text-3xl font-bold text-gray-800">이력서 관리</h2>
          <Button
            onClick={handleCreateNew}
            variant="primary"
            className="transform rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
          >
            새 이력서 작성
          </Button>
        </motion.div>

        {/* 이력서 목록 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {!resumes || resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="py-16 text-center"
            >
              <div className="mb-4 text-6xl text-gray-300">📄</div>
              <p className="mb-4 text-lg text-gray-500">
                작성된 이력서가 없습니다.
              </p>
              <Button
                onClick={handleCreateNew}
                variant="primary"
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
              >
                첫 번째 이력서 작성하기
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 gap-10">
              <AnimatePresence>
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume.resumeId || `resume-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                    className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <motion.h3
                            className="mr-2 mb-2 flex-1 cursor-pointer text-xl font-semibold text-gray-800 transition-colors duration-200 hover:text-blue-600"
                            onClick={() => handleResumeEdit(resume.resumeId)}
                          >
                            {resume.title}
                          </motion.h3>
                          {/* 메뉴 버튼 */}
                          <div className="relative">
                            <motion.button
                              onClick={(e) =>
                                handleMenuToggle(resume.resumeId, e)
                              }
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors"
                            >
                              <i className="xi-ellipsis-v xi-x"></i>
                            </motion.button>
                            {/* 드롭다운 메뉴 */}
                            <AnimatePresence>
                              {openMenuId === resume.resumeId && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-10 right-0 z-50 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
                                >
                                  <button
                                    onClick={(e) =>
                                      handleDownload(resume.resumeId, e)
                                    }
                                    className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                  >
                                    다운로드
                                  </button>
                                  <button
                                    onClick={(e) =>
                                      handleDelete(resume.resumeId, e)
                                    }
                                    className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                  >
                                    삭제하기
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* 기본 정보 */}
                        <div className="mb-3 flex flex-wrap gap-2">
                          {/* 완료된 섹션들 표시 */}
                          {resume.completedSections
                            .slice(0, 3)
                            .map((section, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                              >
                                {section === 'educations'
                                  ? '학력'
                                  : section === 'techStacks'
                                    ? '기술스택'
                                    : section === 'careers'
                                      ? '경력'
                                      : section === 'projects'
                                        ? '프로젝트'
                                        : section === 'trainings'
                                          ? '교육/훈련'
                                          : section === 'additionalInfos'
                                            ? '추가정보'
                                            : section}
                              </span>
                            ))}
                          {resume.completedSections.length > 3 && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                              +{resume.completedSections.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            수정일:{' '}
                            {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* 통계 정보 */}
        {resumeListData && resumeListData.content.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 border-t border-gray-200 pt-6"
          >
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                총 {resumeListData.totalElements}개의 이력서 (페이지{' '}
                {resumeListData.number + 1}/{resumeListData.totalPages})
              </span>
              <span>
                마지막 업데이트:{' '}
                {resumes.length > 0
                  ? new Date(
                      Math.max(
                        ...resumes.map((r) => new Date(r.updatedAt).getTime()),
                      ),
                    ).toLocaleDateString()
                  : '-'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
