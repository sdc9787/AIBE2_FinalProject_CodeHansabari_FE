'use client';

import React, { useState, useEffect } from 'react';
import { useCrawlList, type CrawlItem } from '@/entities/admin';
import { useStartCrawl } from '@/features/start-crawl';
import { useDeleteCrawl } from '@/features/delete-crawl';
import { useUpdateCrawl } from '@/features/update-crawl';

export const AdminCrawl = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<'createdAt' | 'updatedAt' | ''>(
    '',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // applied filters: only these are used for the actual API query
  const [appliedPage, setAppliedPage] = useState(0);
  const [appliedSize, setAppliedSize] = useState(20);
  const [appliedSort, setAppliedSort] = useState<string | undefined>(undefined);

  // (status filter removed)

  // 페이지네이션 정보
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });

  // 수정 모달 상태
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    crawlId: number;
    currentText: string;
  }>({
    isOpen: false,
    crawlId: 0,
    currentText: '',
  });

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

  // 페이지네이션 정보 업데이트
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

  // listen for crawl list updates (dispatched by modal on successful update)
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
    // Reset pagination and page size to defaults
    setPage(0);
    setSize(20);
    setSortField('');
    setSortDirection('desc');
    // also reset applied filters and refetch default list
    setAppliedPage(0);
    setAppliedSize(20);
    setAppliedSort(undefined);
    // let the query refetch with default applied filters
    setTimeout(() => refetch(), 0);
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // when user navigates pages, apply the change immediately
    setAppliedPage(newPage);
    // trigger refetch for the new page
    setTimeout(() => refetch(), 0);
  };

  // 수정 모달 열기/닫기
  const openEditModal = (crawlId: number, currentText: string) => {
    setEditModal({
      isOpen: true,
      crawlId,
      currentText,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      crawlId: 0,
      currentText: '',
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll">
      {/* Header with action button */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold text-black">크롤링 관리</h1>
        <div>
          <button
            onClick={handleStartCrawl}
            disabled={startCrawlMutation.isPending}
            className="rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {startCrawlMutation.isPending ? '크롤링 중...' : '크롤링 시작'}
          </button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="w-full rounded-sm border border-gray-300 bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* (상태 필터 제거됨) */}

          {/* 정렬 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              정렬
            </label>
            <div className="flex gap-2">
              <select
                className="w-1/2 rounded-sm border border-gray-300 px-3 py-1"
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
                className="w-1/2 rounded-sm border border-gray-300 px-3 py-1"
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

          {/* 페이지 크기 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              페이지 크기
            </label>
            <select
              className="w-1/2 rounded-sm border border-gray-300 px-3 py-1"
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
            onClick={() => {
              // apply current selections and refetch
              setAppliedPage(page);
              setAppliedSize(size);
              setAppliedSort(sortParam);
              setTimeout(() => refetch(), 0);
            }}
            className="rounded-sm bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
          >
            검색
          </button>
          <button
            onClick={() => handleDeleteAllCrawl()}
            disabled={
              !crawlPage ||
              !crawlPage.content ||
              crawlPage.content.length === 0 ||
              deleteAllCrawlMutation.isPending
            }
            className="rounded-sm bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            전체 삭제
          </button>
          <button
            onClick={() => refetch()}
            className="rounded-sm bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            새로고침
          </button>
          <button
            onClick={resetFilters}
            className="rounded-sm bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 크롤링 데이터 리스트 */}
      <div className="w-full rounded-sm border border-gray-300 bg-white">
        {/* 헤더 */}
        <div className="grid grid-cols-[0.5fr_3fr_1fr_1fr_0.8fr_1fr] font-bold text-gray-700">
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            ID
          </div>
          <div className="flex h-12 items-center justify-start border-b border-gray-300 bg-gray-50 px-2">
            내용 미리보기
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            생성일
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            수정일
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            상태
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            작업
          </div>

          {/* 데이터 */}
          {queryLoading ? (
            <div className="col-span-6 flex h-20 items-center justify-center">
              <span className="text-gray-500">로딩 중...</span>
            </div>
          ) : content.length === 0 ? (
            <div className="col-span-6 flex h-20 items-center justify-center">
              <span className="text-gray-500">
                조회된 크롤링 데이터가 없습니다.
              </span>
            </div>
          ) : (
            <>
              {content.map((crawl: CrawlItem) => (
                <React.Fragment key={crawl.coverLetterId}>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    {crawl.coverLetterId}
                  </div>
                  <div className="flex h-16 items-center justify-start border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    <span className="truncate" title={crawl.text}>
                      {crawl.text.length > 100
                        ? `${crawl.text.substring(0, 100)}...`
                        : crawl.text}
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {new Date(crawl.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {new Date(crawl.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      완료
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center gap-2 border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <button
                      onClick={() =>
                        openEditModal(crawl.coverLetterId, crawl.text)
                      }
                      disabled={updateCrawlMutation.isPending}
                      className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteAllCrawl(crawl.coverLetterId)}
                      disabled={deleteAllCrawlMutation.isPending}
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
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

      {/* 수정 모달 */}
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

// 크롤링 데이터 수정 모달 컴포넌트
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
          // refresh list after successful update
          // refetch is provided by the parent via closure? use window event or call a passed callback
          // We'll dispatch a custom event so parent can listen and refetch.
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
