'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoverLetterList } from '@/entities';
import { useModalStore } from '@/shared';

export function CoverLetterListModal() {
  const router = useRouter();
  const { close } = useModalStore();
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: coverLetters,
    isLoading,
    error,
  } = useCoverLetterList(currentPage, 'thumbnail');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setExpandedIds(new Set()); // 페이지 변경 시 확장된 목록 초기화
  };

  const renderPaginationButtons = () => {
    if (!coverLetters || coverLetters.totalPages <= 1) return null;

    const buttons = [];
    const totalPages = coverLetters.totalPages;
    const currentPageNumber = coverLetters.pageable.pageNumber;

    // 이전 페이지 버튼
    buttons.push(
      <motion.button
        key="prev"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPageNumber - 1)}
        disabled={currentPageNumber === 0}
        className="mx-1 rounded bg-gray-200 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        이전
      </motion.button>,
    );

    // 페이지 번호 버튼들
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(i)}
          className={`mx-1 rounded px-3 py-1 text-sm ${
            i === currentPageNumber
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i + 1}
        </motion.button>,
      );
    }

    // 다음 페이지 버튼
    buttons.push(
      <motion.button
        key="next"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPageNumber + 1)}
        disabled={currentPageNumber === totalPages - 1}
        className="mx-1 rounded bg-gray-200 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        다음
      </motion.button>,
    );

    return buttons;
  };

  const handleCoverLetterSelect = (coverLetterId: number) => {
    close();
    router.push(`/cover-letter/${coverLetterId}`);
  };

  const toggleExpanded = (coverLetterId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(coverLetterId)) {
        newSet.delete(coverLetterId);
      } else {
        newSet.add(coverLetterId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white p-6"
      >
        <h2 className="mb-4 text-xl font-bold">자소서 목록</h2>
        <div className="flex h-32 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 rounded-full border-b-2 border-blue-500"
          />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white p-6"
      >
        <h2 className="mb-4 text-xl font-bold">자소서 목록</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-8 text-center"
        >
          <p className="text-red-500">자소서 목록을 불러오는데 실패했습니다.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.2 }}
      className="flex max-h-[80vh] w-2xl flex-col overflow-hidden rounded-lg bg-white p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 flex items-center justify-between"
      >
        <h2 className="text-xl font-bold">자소서 목록</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={close}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-y-auto"
      >
        {coverLetters?.content.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-8 text-center"
          >
            <p className="text-gray-500">작성된 자소서가 없습니다.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {coverLetters?.content.map((coverLetter, index) => {
                const isExpanded = expandedIds.has(coverLetter.coverLetterId);

                return (
                  <motion.div
                    key={coverLetter.coverLetterId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="mr-2 flex-1 truncate text-lg font-semibold">
                        {coverLetter.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap text-gray-500">
                          {new Date(coverLetter.updatedAt).toLocaleDateString()}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) =>
                            toggleExpanded(coverLetter.coverLetterId, e)
                          }
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ▼
                          </motion.span>
                        </motion.button>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="mb-2 flex gap-2"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
                      >
                        {coverLetter.jobField}
                      </motion.span>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="rounded bg-green-100 px-2 py-1 text-xs text-green-700"
                      >
                        경력 {coverLetter.experience}
                      </motion.span>
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-gray-600"
                        >
                          <p>{coverLetter.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 flex justify-end"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleCoverLetterSelect(coverLetter.coverLetterId)
                        }
                        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                      >
                        불러오기
                      </motion.button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {coverLetters && coverLetters.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 space-y-3 border-t pt-4"
        >
          {/* <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              총 {coverLetters.totalElements}개
            </span>
            <span className="text-sm text-gray-600">
              {coverLetters.pageable.pageNumber + 1} / {coverLetters.totalPages}
            </span>
          </div> */}
          <div className="flex justify-center">{renderPaginationButtons()}</div>
        </motion.div>
      )}
    </motion.div>
  );
}
