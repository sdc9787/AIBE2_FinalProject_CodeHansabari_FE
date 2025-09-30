'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeList, useResumeMetadata, useResumeDetail } from '@/entities';
import { Button, useModalStore } from '@/shared';

import { useDeleteResumeMutation } from '@/features';
import { ConvertResumeModal, ResumePreviewModal } from '@/widgets/resume';
import { CoverLetter } from '@/widgets/coverLetter/ui/coverLetter';
import { useCoverLetterList } from '@/entities';
import { useDeleteCoverLetter } from '@/features/delete-coverLetter/model/useDeleteCoverLetter';

export function Document() {
  const router = useRouter();
  const deleteCoverLetterMutation = useDeleteCoverLetter();
  const [page, setPage] = useState<number>(0);
  const size = 6; // 한 페이지에 보여줄 항목 수
  const [showConvertModal, setShowConvertModal] = useState(false);
  const {
    data: resumeListData,
    isLoading,
    error,
  } = useResumeList({ page, size });
  const deleteResumeMutation = useDeleteResumeMutation();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>(
    'resume',
  );

  const completedSectionsList = {
    educations: '학력',
    techStacks: '기술스택',
    customLinks: '링크',
    careers: '경력',
    projects: '프로젝트',
    trainings: '교육',
    additionalInfos: '추가정보',
  };

  const resumes = resumeListData?.content || [];

  const handleResumeEdit = (resumeId: number) => {
    router.push(`/resume/edit/${resumeId}`);
  };

  const handleCreateNew = () => {
    router.push('/resume/document');
  };

  const handleConvertResume = () => {
    setShowConvertModal(true);
  };

  const handleMenuToggle = (resumeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === resumeId ? null : resumeId);
  };

  const handleDownload = (resumeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // 모달로 이력서 미리보기 표시 (다운로드 전 미리보기)
    useModalStore
      .getState()
      .open(
        <PreviewWrapper resumeId={resumeId} />,
        undefined,
        undefined,
        'center',
      );
    setOpenMenuId(null);
  };

  const handleDelete = (resumeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm('정말 이 이력서를 삭제하시겠습니까?')) {
      setOpenMenuId(null);
      return;
    }

    // 실제 삭제 수행
    deleteResumeMutation.mutate(resumeId, {
      onError: () => {
        // 실패시 추가 처리 필요하면 여기서
      },
      onSettled: () => {
        // 메뉴 닫기
        setOpenMenuId(null);
      },
    });
  };

  // Preview wrapper component: fetches resume detail & metadata, then renders ResumePreviewModal
  const PreviewWrapper = ({ resumeId }: { resumeId: number }) => {
    const { data: DataForm, isLoading: detailLoading } =
      useResumeDetail(resumeId);
    const { data: MetaData } = useResumeMetadata();
    const close = useModalStore.getState().close;

    if (detailLoading || !DataForm || !MetaData) {
      return (
        <div className="p-8 text-center text-gray-600">
          이력서 정보를 불러오는 중...
        </div>
      );
    }

    return (
      <ResumePreviewModal
        onClose={close}
        DataForm={DataForm}
        MetaData={MetaData}
      />
    );
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
    <div className="mx-auto mt-10 max-w-7xl">
      {/* 상단 탭: 이력서 / 자기소개서 */}
      <div className="mb-6 flex items-center justify-start gap-4">
        <button
          onClick={() => setActiveTab('resume')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'resume'
              ? 'bg-blue-600 text-white shadow'
              : 'border bg-white text-gray-700'
          }`}
        >
          이력서 관리
        </button>
        <button
          onClick={() => setActiveTab('coverLetter')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'coverLetter'
              ? 'bg-blue-600 text-white shadow'
              : 'border bg-white text-gray-700'
          }`}
        >
          자기소개서 관리
        </button>
      </div>

      {/* 탭별 콘텐츠 */}
      {activeTab === 'resume' ? (
        <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          {/* 기존 이력서 관리 UI (unchanged) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex items-center justify-between"
          >
            <h2 className="text-3xl font-bold text-gray-800">이력서 관리</h2>
            <div className="flex space-x-3">
              <div className="group relative">
                <Button
                  onClick={handleConvertResume}
                  variant="secondary"
                  className="transform rounded-xl border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-50"
                >
                  이력서 변환
                </Button>

                <div className="pointer-events-none absolute top-full right-0 z-10 mt-2 w-40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
                    예상 사용 토큰: <span className="font-medium">5</span>개
                  </div>
                  <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-gray-800"></div>
                </div>
              </div>
              <Button
                onClick={handleCreateNew}
                variant="primary"
                className="transform rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
              >
                새 이력서 작성
              </Button>
            </div>
          </motion.div>

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
              <div className="grid w-full grid-cols-3 gap-10">
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
                      className="relative w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-200"
                    >
                      <div className="flex w-full items-start justify-between">
                        <div className="w-full flex-1">
                          <div className="flex w-full items-start justify-between">
                            <motion.h3
                              className="mb-2 block w-full flex-1 cursor-pointer truncate text-xl font-semibold text-gray-800 transition-colors duration-200 hover:text-blue-600"
                              title={resume.title}
                              onClick={() => handleResumeEdit(resume.resumeId)}
                            >
                              {resume.title}
                            </motion.h3>
                            <div className="relative">
                              <motion.button
                                onClick={(e) =>
                                  handleMenuToggle(resume.resumeId, e)
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors"
                              >
                                <i className="xi-ellipsis-v xi-x"></i>
                              </motion.button>
                              <AnimatePresence>
                                {openMenuId === resume.resumeId && (
                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      scale: 0.95,
                                      y: -10,
                                    }}
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

                          <div className="mb-3 flex flex-wrap gap-2">
                            {resume.completedSections.map((section, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                              >
                                {completedSectionsList[
                                  section as keyof typeof completedSectionsList
                                ] || section}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              수정일 :&nbsp;
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

          {resumeListData && resumeListData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0}
                className="rounded-md border px-3 py-1 text-sm text-gray-700 disabled:opacity-40"
              >
                이전
              </button>
              {Array.from({ length: resumeListData.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`rounded-md px-3 py-1 text-sm ${i === page ? 'bg-blue-600 text-white' : 'border text-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min((resumeListData.totalPages || 1) - 1, p + 1),
                  )
                }
                disabled={page >= (resumeListData.totalPages || 1) - 1}
                className="rounded-md border px-3 py-1 text-sm text-gray-700 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}

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
                          ...resumes.map((r) =>
                            new Date(r.updatedAt).getTime(),
                          ),
                        ),
                      ).toLocaleDateString()
                    : '-'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        // CoverLetter 관리 탭을 선택한 경우: 목록을 보여주고 불러오기 가능
        <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex items-center justify-between"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              자기소개서 관리
            </h2>
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push('/cover-letter/new')}
                variant="primary"
                className="transform rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
              >
                새 자기소개서 작성
              </Button>
            </div>
          </motion.div>

          <CoverLetterList />
        </div>
      )}
      <ConvertResumeModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
      />
    </div>
  );
}

function CoverLetterList() {
  const [page, setPage] = useState(0);
  const {
    data: listData,
    isLoading,
    error,
  } = useCoverLetterList(page, 'thumbnail');
  const router = useRouter();
  const deleteMutation = useDeleteCoverLetter();

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
        <p className="mt-4 text-gray-600">자기소개서 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">
          자기소개서 목록을 불러오는데 실패했습니다.
        </p>
      </div>
    );
  }

  const coverLetters = listData?.content || [];

  return (
    <div>
      {coverLetters.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl text-gray-300">✉️</div>
          <p className="mb-4 text-lg text-gray-500">
            작성된 자기소개서가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-3 gap-10">
          <AnimatePresence>
            {coverLetters.map((c, index) => (
              <motion.div
                key={c.coverLetterId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="relative w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-200"
              >
                <div className="flex w-full items-start justify-between">
                  <div className="w-full flex-1">
                    <div className="flex w-full items-start justify-between">
                      <motion.h3
                        className="mb-2 block w-full flex-1 cursor-pointer truncate text-xl font-semibold text-gray-800 transition-colors duration-200 hover:text-blue-600"
                        title={c.title}
                        onClick={() =>
                          router.push(`/cover-letter/${c.coverLetterId}`)
                        }
                      >
                        {c.title}
                      </motion.h3>
                      {/* 삭제 아이콘: 모달 대신 아이콘으로 삭제 처리 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            !confirm('정말 이 자기소개서를 삭제하시겠습니까?')
                          )
                            return;
                          deleteMutation.mutate(c.coverLetterId);
                        }}
                        className="ml-3 cursor-pointer text-red-500 hover:text-red-700"
                        aria-label="삭제"
                        title="삭제"
                      >
                        <i className="xi-trash-o xi-x" />
                      </button>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                        {c.jobField}
                      </span>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        경력 {c.experience}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        수정일 :&nbsp;
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {listData && listData.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page <= 0}
            className="rounded-md border px-3 py-1 text-sm text-gray-700 disabled:opacity-40"
          >
            이전
          </button>

          {Array.from({ length: listData.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-md px-3 py-1 text-sm ${
                i === page ? 'bg-blue-600 text-white' : 'border text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setPage((p) => Math.min((listData.totalPages || 1) - 1, p + 1))
            }
            disabled={page >= (listData.totalPages || 1) - 1}
            className="rounded-md border px-3 py-1 text-sm text-gray-700 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {listData && listData.content.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 border-t border-gray-200 pt-6"
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              총 {listData.totalElements}개의 자기소개서 (페이지{' '}
              {listData.pageable.pageNumber + 1}/{listData.totalPages})
            </span>
            <span>
              마지막 업데이트:{' '}
              {coverLetters.length > 0
                ? new Date(
                    Math.max(
                      ...coverLetters.map((c) =>
                        new Date(c.updatedAt).getTime(),
                      ),
                    ),
                  ).toLocaleDateString()
                : '-'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
