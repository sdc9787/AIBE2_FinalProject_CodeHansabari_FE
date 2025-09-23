'use client';

import React, { useState, useEffect } from 'react';
import { useCrawlList, type CrawlItem } from '@/entities/admin';
import { useStartCrawl } from '@/features/start-crawl';
import { useDeleteCrawl } from '@/features/delete-crawl';
import { useUpdateCrawl } from '@/features/update-crawl';

export const AdminCrawl = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortField, setSortField] = useState<'createdAt' | 'updatedAt' | ''>(
    '',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [appliedPage, setAppliedPage] = useState(0);
  const [appliedSize, setAppliedSize] = useState(20);
  const [appliedSort, setAppliedSort] = useState<string | undefined>(undefined);

  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    crawlId: number;
    currentText: string;
  }>({ isOpen: false, crawlId: 0, currentText: '' });

  const sortParam = sortField ? `${sortField},${sortDirection}` : undefined;

  const {
    data: crawlPage,
    isLoading: queryLoading,
    error,
    refetch,
  } = useCrawlList({ page: appliedPage, size: appliedSize, sort: appliedSort });
  const content = crawlPage?.content ?? [];

  const startCrawlMutation = useStartCrawl();
  const deleteAllCrawlMutation = useDeleteCrawl();
  const updateCrawlMutation = useUpdateCrawl();

  useEffect(() => {
    if (crawlPage) {
      setPageInfo({
        totalElements: crawlPage.totalElements,
        totalPages: crawlPage.totalPages,
        currentPage: page,
        pageSize: size,
      });
    }
  }, [crawlPage, page, size]);

  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener('crawlListUpdated', handler as EventListener);
    return () =>
      window.removeEventListener('crawlListUpdated', handler as EventListener);
  }, [refetch]);

  const handleStartCrawl = () => startCrawlMutation.mutate({});

  const handleDeleteAllCrawl = (crawlId?: number) => {
    const confirmMessage = crawlId
      ? '선택한 크롤링 데이터를 삭제하시겠습니까?'
      : '모든 크롤링 데이터를 삭제하시겠습니까?';
    if (!window.confirm(confirmMessage)) return;
    if (crawlId) deleteAllCrawlMutation.mutate({ id: crawlId });
    else deleteAllCrawlMutation.mutate({});
  };

  const resetFilters = () => {
    setPage(0);
    setSize(20);
    setSortField('');
    setSortDirection('desc');
    setAppliedPage(0);
    setAppliedSize(20);
    setAppliedSort(undefined);
    setTimeout(() => refetch(), 0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) return;
    setPage(newPage);
    setAppliedPage(newPage);
    setTimeout(() => refetch(), 0);
  };

  const openEditModal = (crawlId: number, currentText: string) =>
    setEditModal({ isOpen: true, crawlId, currentText });
  const closeEditModal = () =>
    setEditModal({ isOpen: false, crawlId: 0, currentText: '' });

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-black">크롤링 관리</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            새로고침
          </button>
          <button
            onClick={handleStartCrawl}
            disabled={startCrawlMutation.isPending}
            className="rounded bg-indigo-500 px-3 py-1.5 text-sm text-white hover:bg-indigo-600"
          >
            {startCrawlMutation.isPending ? '크롤링 중...' : '크롤링 시작'}
          </button>
        </div>
      </div>

      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              정렬
            </label>
            <div className="flex gap-2">
              <select
                className="w-1/2 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                value={sortField}
                onChange={(e) => {
                  setSortField(e.target.value as any);
                  setPage(0);
                }}
              >
                <option value="">정렬 없음</option>
                <option value="createdAt">생성일</option>
                <option value="updatedAt">수정일</option>
              </select>
              <select
                className="w-1/2 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                value={sortDirection}
                onChange={(e) => {
                  setSortDirection(e.target.value as any);
                  setPage(0);
                }}
              >
                <option value="desc">내림차순</option>
                <option value="asc">오름차순</option>
              </select>
            </div>
          </div>

          <div className="col-start-4 flex items-end justify-end">
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                필터 초기화
              </button>
              <button
                onClick={() => handleDeleteAllCrawl()}
                disabled={
                  !crawlPage ||
                  !crawlPage.content ||
                  crawlPage.content.length === 0 ||
                  deleteAllCrawlMutation.isPending
                }
                className="rounded border border-red-500 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                전체 삭제
              </button>
              <button
                onClick={() => {
                  setAppliedPage(page);
                  setAppliedSize(size);
                  setAppliedSort(sortParam);
                  setTimeout(() => refetch(), 0);
                }}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                검색
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  ID
                </th>
                <th className="w-5/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  내용 미리보기
                </th>
                <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                  생성일
                </th>
                <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                  수정일
                </th>
                <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                  상태
                </th>
                <th className="w-3/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {queryLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">로딩 중...</div>
                  </td>
                </tr>
              ) : content.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    조회된 크롤링 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                content.map((crawl: CrawlItem) => (
                  <tr key={crawl.coverLetterId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                      #{crawl.coverLetterId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="truncate text-sm text-gray-900"
                        title={crawl.text}
                      >
                        {crawl.text.length > 120
                          ? `${crawl.text.substring(0, 120)}...`
                          : crawl.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                      {new Date(crawl.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                      {new Date(crawl.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex rounded-sm bg-green-100 px-2 py-1 text-xs leading-5 font-semibold text-green-800">
                        완료
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            openEditModal(crawl.coverLetterId, crawl.text)
                          }
                          disabled={updateCrawlMutation.isPending}
                          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAllCrawl(crawl.coverLetterId)
                          }
                          disabled={deleteAllCrawlMutation.isPending}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            전체 {pageInfo.totalElements.toLocaleString()}개 중{' '}
            {pageInfo.currentPage * pageInfo.pageSize + 1}-
            {Math.min(
              (pageInfo.currentPage + 1) * pageInfo.pageSize,
              pageInfo.totalElements,
            )}{' '}
            개 표시
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(0)}
              disabled={pageInfo.currentPage === 0}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              처음
            </button>
            <button
              onClick={() => handlePageChange(pageInfo.currentPage - 1)}
              disabled={pageInfo.currentPage === 0}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              이전
            </button>
            <span className="px-3 py-1 text-sm">
              {pageInfo.currentPage + 1} / {pageInfo.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pageInfo.currentPage + 1)}
              disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              다음
            </button>
            <button
              onClick={() => handlePageChange(pageInfo.totalPages - 1)}
              disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              마지막
            </button>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
                setTimeout(() => refetch(), 0);
              }}
              className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={5}>5개씩</option>
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
            </select>
          </div>
        </div>
      </div>

      {editModal.isOpen && (
        <EditCrawlModal
          crawlId={editModal.crawlId}
          currentText={editModal.currentText}
          onClose={closeEditModal}
          mutation={updateCrawlMutation}
        />
      )}
    </div>
  );
};

const EditCrawlModal = ({
  crawlId,
  currentText,
  onClose,
  mutation,
}: {
  crawlId: number;
  currentText: string;
  onClose: () => void;
  mutation: any;
}) => {
  const [text, setText] = useState(currentText);

  const handleSubmit = () => {
    if (!text.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    mutation.mutate(
      { crawlId, text },
      {
        onSuccess: () => {
          onClose();
          window.dispatchEvent(new CustomEvent('crawlListUpdated'));
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 max-w-lg rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-bold">크롤링 데이터 수정</h3>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">내용</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-40 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="크롤링 데이터 내용을 입력해주세요"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? '수정 중...' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
};
