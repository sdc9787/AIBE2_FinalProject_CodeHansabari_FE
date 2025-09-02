'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCoverLetterList } from '@/entities';
import { useModalStore } from '@/shared';

export function CoverLetterListModal() {
  const router = useRouter();
  const { close } = useModalStore();
  const { data: coverLetters, isLoading, error } = useCoverLetterList();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

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
      <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">자소서 목록</h2>
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">자소서 목록</h2>
        <div className="py-8 text-center">
          <p className="text-red-500">자소서 목록을 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">자소서 목록</h2>
        <button onClick={close} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {coverLetters?.content.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">작성된 자소서가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {coverLetters?.content.map((coverLetter) => {
              const isExpanded = expandedIds.has(coverLetter.coverLetterId);

              return (
                <div
                  key={coverLetter.coverLetterId}
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
                      <button
                        onClick={(e) =>
                          toggleExpanded(coverLetter.coverLetterId, e)
                        }
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  <div className="mb-2 flex gap-2">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      {coverLetter.jobField}
                    </span>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                      경력 {coverLetter.experience}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className={isExpanded ? '' : 'line-clamp-2'}>
                      {coverLetter.content}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() =>
                        handleCoverLetterSelect(coverLetter.coverLetterId)
                      }
                      className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                    >
                      불러오기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {coverLetters && coverLetters.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-sm text-gray-600">
            총 {coverLetters.totalElements}개 중 {coverLetters.content.length}개
            표시
          </span>
          <span className="text-sm text-gray-600">
            {coverLetters.pageable.pageNumber + 1} / {coverLetters.totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
