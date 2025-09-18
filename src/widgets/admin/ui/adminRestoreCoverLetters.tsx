'use client';

import React, { useState, useEffect } from 'react';
import { useAdminCoverLetters } from '@/entities/admin';
import { useRestoreCoverLetter } from '@/features/restore-coverLetter';

export const AdminRestoreCoverLetters = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<{
    status: 'ACTIVE' | 'DELETED' | 'ALL';
    email: string;
    title: string;
  }>({ status: 'DELETED', email: '', title: '' });

  // 페이지네이션 정보
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  const formatStatusForApi = (s: typeof filters.status) =>
    s === 'ALL' ? undefined : (s as 'ACTIVE' | 'DELETED');

  const {
    data,
    isLoading: queryLoading,
    error,
    refetch,
  } = useAdminCoverLetters({
    page,
    size,
    status: formatStatusForApi(filters.status),
    email: filters.email || undefined,
    title: filters.title || undefined,
  });

  const content = data?.content ?? [];
  const restoreMutation = useRestoreCoverLetter();

  // 페이지네이션 정보 업데이트
  useEffect(() => {
    if (data) {
      setPageInfo({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: page,
        pageSize: size,
      });
    }
  }, [data, page, size]);

  const handleRestore = (id: number) => {
    if (!window.confirm('자소서를 복구하시겠습니까?')) return;
    restoreMutation.mutate(id);
  };

  const resetFilters = () => {
    setFilters({ status: 'DELETED', email: '', title: '' });
    setPage(0);
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-800';
    if (status === 'DELETED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll">
      <h1 className="text-xl font-bold text-black">자기소개서 복구</h1>

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
              <option value="ALL">전체</option>
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

      {/* 자기소개서 리스트 */}
      <div className="w-full rounded-sm border border-gray-300 bg-white">
        {/* 헤더 */}
        <div className="grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_0.8fr_0.8fr] font-bold text-gray-700">
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            ID
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            작성자
          </div>
          <div className="flex h-12 items-center justify-start border-b border-gray-300 bg-gray-50 px-2">
            제목
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            생성일
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            삭제일
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            상태
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            작업
          </div>

          {/* 데이터 */}
          {queryLoading ? (
            <div className="col-span-7 flex h-20 items-center justify-center">
              <span className="text-gray-500">로딩 중...</span>
            </div>
          ) : content.length === 0 ? (
            <div className="col-span-7 flex h-20 items-center justify-center">
              <span className="text-gray-500">
                조회된 자기소개서가 없습니다.
              </span>
            </div>
          ) : (
            <>
              {content.map((item) => (
                <React.Fragment key={item.coverLetterId}>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    {item.coverLetterId}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {item.authorEmail}
                  </div>
                  <div className="flex h-16 items-center justify-start border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    <span className="truncate" title={item.title}>
                      {item.title}
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : '-'}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleDateString()
                      : '-'}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                    >
                      {item.status === 'ACTIVE' ? '활성화' : '삭제됨'}
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <button
                      onClick={() => handleRestore(item.coverLetterId)}
                      disabled={
                        item.status === 'ACTIVE' || restoreMutation.isPending
                      }
                      className={`rounded px-3 py-1 text-sm font-medium ${
                        item.status === 'ACTIVE'
                          ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      복구
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      {
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(0)}
            disabled={pageInfo.currentPage === 0}
            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            처음
          </button>
          <button
            onClick={() => handlePageChange(pageInfo.currentPage - 1)}
            disabled={pageInfo.currentPage === 0}
            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            이전
          </button>

          <span className="px-3 py-1 text-sm text-gray-700">
            {pageInfo.currentPage + 1} / {pageInfo.totalPages}
            <span className="ml-2 text-gray-500">
              (총 {pageInfo.totalElements}개)
            </span>
          </span>

          <button
            onClick={() => handlePageChange(pageInfo.currentPage + 1)}
            disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            다음
          </button>
          <button
            onClick={() => handlePageChange(pageInfo.totalPages - 1)}
            disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            마지막
          </button>
        </div>
      }
    </div>
  );
};
