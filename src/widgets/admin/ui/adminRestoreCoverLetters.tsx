'use client';

import { Button } from '@/shared/ui';
import { useState, useEffect } from 'react';
import { useAdminCoverLetters } from '@/entities/admin';
import { useRestoreCoverLetter } from '@/features/restore-coverLetter';

export const AdminRestoreCoverLetters = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [filters, setFilters] = useState<{
    status: 'ACTIVE' | 'DELETED' | 'ALL';
    email: string;
    title: string;
  }>({ status: 'DELETED', email: '', title: '' });

  const formatStatusForApi = (s: typeof filters.status) =>
    s === 'ALL' ? undefined : (s as 'ACTIVE' | 'DELETED');

  const { data, isLoading, error, refetch } = useAdminCoverLetters({
    page,
    size,
    status: formatStatusForApi(filters.status),
    email: filters.email || undefined,
    title: filters.title || undefined,
  });
  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const restoreMutation = useRestoreCoverLetter();

  const handleRestore = (id: number) => {
    if (!window.confirm('자소서를 복구하시겠습니까?')) return;
    restoreMutation.mutate(id);
  };

  const resetFilters = () => {
    setFilters({ status: 'DELETED', email: '', title: '' });
    setPage(0);
  };

  useEffect(() => {
    refetch();
  }, [page, size]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">자기소개서 복구</h1>
          <p className="mt-1 text-sm text-gray-600">
            삭제된 자기소개서를 관리자 권한으로 복구합니다.
          </p>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="w-full rounded-sm border border-gray-300 bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 상태 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              상태
            </label>
            <select
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as any,
                }))
              }
            >
              <option value="DELETED">DELETED</option>
              <option value="ACTIVE">ACTIVE</option>
            </select>
          </div>

          {/* 작성자 이메일 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              작성자 이메일
            </label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              placeholder="이메일 부분 검색"
              value={filters.email}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, email: e.target.value }));
                setPage(0);
              }}
            />
          </div>

          {/* 제목 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              제목
            </label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              placeholder="제목 부분 검색"
              value={filters.title}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, title: e.target.value }));
                setPage(0);
              }}
            />
          </div>

          {/* 페이지 크기 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              페이지 크기
            </label>
            <select
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            검색
          </button>
          <button
            onClick={resetFilters}
            className="rounded-sm bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#e2e8f0] bg-white">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            복구 가능한 자기소개서 목록
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">로딩 중...</div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">목록을 불러오는데 실패했습니다.</p>
            <Button onClick={() => refetch()}>다시 시도</Button>
          </div>
        ) : content.length === 0 ? (
          <div className="p-8 text-center">
            복구 가능한 자기소개서가 없습니다.
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <div className="hidden grid-cols-12 bg-[#fafbfc] p-3 text-sm font-medium text-gray-700 md:grid">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">작성자</div>
                <div className="col-span-4">제목</div>
                <div className="col-span-2">삭제일</div>
                <div className="col-span-1">상태</div>
                <div className="col-span-1">작업</div>
              </div>

              <div>
                {content.map((item) => (
                  <div
                    key={item.coverLetterId}
                    className="flex flex-col gap-2 border-b px-4 py-3 hover:bg-gray-50 md:grid md:grid-cols-12 md:items-center"
                  >
                    <div className="font-mono text-sm text-gray-800 md:col-span-1">
                      {item.coverLetterId}
                    </div>
                    <div className="text-sm text-gray-700 md:col-span-3">
                      {item.authorEmail}
                    </div>
                    <div className="text-sm text-gray-700 md:col-span-4">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600 md:col-span-2">
                      {item.deletedAt ?? '-'}
                    </div>
                    <div className="flex items-center justify-center md:col-span-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-center md:col-span-1">
                      <Button
                        onClick={() => handleRestore(item.coverLetterId)}
                        disabled={item.status === 'ACTIVE'}
                        aria-disabled={item.status === 'ACTIVE'}
                        className={
                          item.status === 'ACTIVE'
                            ? 'cursor-not-allowed rounded-md bg-gray-300 px-3 py-1 text-sm text-white disabled:opacity-75'
                            : 'rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                        }
                      >
                        복구
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-gray-600">
                총 페이지: {totalPages || '-'} / 총 항목: {totalElements || '-'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page <= 0}
                  className="rounded-sm bg-gray-100 px-3 py-1 disabled:opacity-50"
                >
                  이전
                </button>

                {Array.from({ length: Math.max(0, totalPages) }).map((_, i) => {
                  const start = Math.max(0, page - 2);
                  const end = Math.min(totalPages - 1, page + 2);
                  if (i < start || i > end) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`rounded-sm px-3 py-1 ${i === page ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={totalPages <= 1 || page >= totalPages - 1}
                  className="rounded-sm bg-gray-100 px-3 py-1 disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
