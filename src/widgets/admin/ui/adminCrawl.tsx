'use client';

import React, { useState, useEffect } from 'react';
import { useCrawlList, type CrawlItem } from '@/entities/admin';
import { useStartCrawl } from '@/features/start-crawl';
import { useDeleteCrawl } from '@/features/delete-crawl';
import { useUpdateCrawl } from '@/features/update-crawl';
import {
  useExtractCoverLetterFeatures,
  useDeduplicateCoverLetterFeatures,
} from '@/features/cover-letter-features';
import {
  useRawCoverLetterFeatures,
  useRawCoverLetterFeaturesByCategory,
  useCoverLetterFeatures,
  useCoverLetterFeaturesByCategory,
} from '@/entities/coverLetterFeatures/model/query';

export const AdminCrawl = () => {
  // 공유 필터 상태 (3개 탭 공유)
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortField, setSortField] = useState<'createdAt' | 'updatedAt' | ''>(
    '',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [category, setCategory] = useState<
    'EXPRESSION' | 'STRUCTURE' | 'CONTENT' | ''
  >('');

  // 쿼리 실행을 위한 별도 상태 (탭별로 분리)
  const [crawlExecutedPage, setCrawlExecutedPage] = useState(0);
  const [crawlExecutedSize, setCrawlExecutedSize] = useState(20);
  const [crawlExecutedSortField, setCrawlExecutedSortField] = useState<
    'createdAt' | 'updatedAt' | ''
  >('');
  const [crawlExecutedSortDirection, setCrawlExecutedSortDirection] = useState<
    'asc' | 'desc'
  >('desc');

  const [extractExecutedPage, setExtractExecutedPage] = useState(0);
  const [extractExecutedSize, setExtractExecutedSize] = useState(20);
  const [extractExecutedSortField, setExtractExecutedSortField] = useState<
    'createdAt' | 'updatedAt' | ''
  >('');
  const [extractExecutedSortDirection, setExtractExecutedSortDirection] =
    useState<'asc' | 'desc'>('desc');
  const [extractExecutedCategory, setExtractExecutedCategory] = useState<
    'EXPRESSION' | 'STRUCTURE' | 'CONTENT' | ''
  >('');

  const [finalExecutedPage, setFinalExecutedPage] = useState(0);
  const [finalExecutedSize, setFinalExecutedSize] = useState(20);
  const [finalExecutedSortField, setFinalExecutedSortField] = useState<
    'createdAt' | 'updatedAt' | ''
  >('');
  const [finalExecutedSortDirection, setFinalExecutedSortDirection] = useState<
    'asc' | 'desc'
  >('desc');
  const [finalExecutedCategory, setFinalExecutedCategory] = useState<
    'EXPRESSION' | 'STRUCTURE' | 'CONTENT' | ''
  >('');

  // UI 상태
  const [activeTab, setActiveTab] = useState<
    'crawling' | 'extract' | 'deduplication'
  >('crawling');

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    crawlId: number;
    currentText: string;
  }>({ isOpen: false, crawlId: 0, currentText: '' });

  // 파라미터 생성 (탭별 실행 값들로 생성)
  const crawlExecutedSortParam = crawlExecutedSortField
    ? `${crawlExecutedSortField},${crawlExecutedSortDirection}`
    : undefined;
  const extractExecutedSortParam = extractExecutedSortField
    ? `${extractExecutedSortField},${extractExecutedSortDirection}`
    : undefined;
  const finalExecutedSortParam = finalExecutedSortField
    ? `${finalExecutedSortField},${finalExecutedSortDirection}`
    : undefined;

  // API 호출
  const startCrawlMutation = useStartCrawl();
  const deleteAllCrawlMutation = useDeleteCrawl();
  const updateCrawlMutation = useUpdateCrawl();
  const extractMutation = useExtractCoverLetterFeatures();
  const dedupMutation = useDeduplicateCoverLetterFeatures();

  // 크롤링 데이터 (카테고리 없음) - 실행된 필터 값으로 조회, page만 실시간 반영
  const {
    data: crawlPage,
    isLoading: crawlLoading,
    refetch: refetchCrawl,
  } = useCrawlList({
    page: crawlExecutedPage,
    size: crawlExecutedSize,
    sort: crawlExecutedSortParam,
  });

  // 특징 추출 데이터 (카테고리 있을 때와 없을 때)
  const rawQuery = useRawCoverLetterFeatures(
    extractExecutedPage,
    extractExecutedSize,
    extractExecutedSortParam,
  );
  const rawByCategoryQuery = useRawCoverLetterFeaturesByCategory(
    extractExecutedCategory,
    extractExecutedPage,
    extractExecutedSize,
    extractExecutedSortParam,
  );

  // 중복 제거 데이터 (카테고리 있을 때와 없을 때)
  const finalQuery = useCoverLetterFeatures(
    finalExecutedPage,
    finalExecutedSize,
    finalExecutedSortParam,
  );
  const finalByCategoryQuery = useCoverLetterFeaturesByCategory(
    finalExecutedCategory,
    finalExecutedPage,
    finalExecutedSize,
    finalExecutedSortParam,
  );

  // 현재 표시할 데이터 결정
  const currentExtractQuery = extractExecutedCategory
    ? rawByCategoryQuery
    : rawQuery;
  const currentFinalQuery = finalExecutedCategory
    ? finalByCategoryQuery
    : finalQuery;

  // 카테고리 라벨 매핑 (영문 키 -> 한글)
  const categoryLabel = (key: string | undefined | null) => {
    switch (key) {
      case 'EXPRESSION':
        return '표현';
      case 'STRUCTURE':
        return '구조';
      case 'CONTENT':
        return '내용';
      default:
        return '';
    }
  };

  // 초기 로드 시 각 탭의 executed 상태를 현재 필터 상태로 설정
  useEffect(() => {
    setCrawlExecutedPage(page);
    setCrawlExecutedSize(size);
    setCrawlExecutedSortField(sortField);
    setCrawlExecutedSortDirection(sortDirection);

    setExtractExecutedPage(page);
    setExtractExecutedSize(size);
    setExtractExecutedSortField(sortField);
    setExtractExecutedSortDirection(sortDirection);
    setExtractExecutedCategory(category);

    setFinalExecutedPage(page);
    setFinalExecutedSize(size);
    setFinalExecutedSortField(sortField);
    setFinalExecutedSortDirection(sortDirection);
    setFinalExecutedCategory(category);
  }, []);

  // 핸들러 함수들
  const handleSearch = () => {
    // 검색 버튼 클릭 시 activeTab에 해당하는 탭의 executed 상태만 업데이트
    if (activeTab === 'crawling') {
      setCrawlExecutedPage(0);
      setCrawlExecutedSize(size);
      setCrawlExecutedSortField(sortField);
      setCrawlExecutedSortDirection(sortDirection);
    } else if (activeTab === 'extract') {
      setExtractExecutedPage(0);
      setExtractExecutedSize(size);
      setExtractExecutedSortField(sortField);
      setExtractExecutedSortDirection(sortDirection);
      setExtractExecutedCategory(category);
    } else if (activeTab === 'deduplication') {
      setFinalExecutedPage(0);
      setFinalExecutedSize(size);
      setFinalExecutedSortField(sortField);
      setFinalExecutedSortDirection(sortDirection);
      setFinalExecutedCategory(category);
    }
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    // 페이지 변경 시에는 activeTab에 해당하는 executed 상태 업데이트
    if (newPage < 0) return;
    setPage(newPage);
    if (activeTab === 'crawling') {
      setCrawlExecutedPage(newPage);
    } else if (activeTab === 'extract') {
      setExtractExecutedPage(newPage);
    } else if (activeTab === 'deduplication') {
      setFinalExecutedPage(newPage);
    }
  };
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
    setCategory('');
    // 탭별 executed 상태도 함께 리셋
    setCrawlExecutedPage(0);
    setCrawlExecutedSize(20);
    setCrawlExecutedSortField('');
    setCrawlExecutedSortDirection('desc');

    setExtractExecutedPage(0);
    setExtractExecutedSize(20);
    setExtractExecutedSortField('');
    setExtractExecutedSortDirection('desc');
    setExtractExecutedCategory('');

    setFinalExecutedPage(0);
    setFinalExecutedSize(20);
    setFinalExecutedSortField('');
    setFinalExecutedSortDirection('desc');
    setFinalExecutedCategory('');
  };

  const openEditModal = (crawlId: number, currentText: string) =>
    setEditModal({ isOpen: true, crawlId, currentText });
  const closeEditModal = () =>
    setEditModal({ isOpen: false, crawlId: 0, currentText: '' });

  // 탭 변경 시 페이지 리셋
  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-black">크롤링 관리</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetchCrawl()}
            className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>

      <div className="flex w-full border-b border-gray-300">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'crawling' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('crawling')}
        >
          크롤링
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'extract' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('extract')}
        >
          특징 추출
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'deduplication' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('deduplication')}
        >
          중복 제거
        </button>
      </div>

      {activeTab === 'crawling' && (
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
                    e.preventDefault();
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
                    e.preventDefault();
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
                  onClick={handleSearch}
                  className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  검색
                </button>
                <button
                  onClick={handleStartCrawl}
                  disabled={startCrawlMutation.isPending}
                  className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                  {startCrawlMutation.isPending
                    ? '크롤링 중...'
                    : '크롤링 시작'}
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    크롤링 ID
                  </th>
                  <th className="w-7/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
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
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    수정
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {crawlLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        로딩 중...
                      </div>
                    </td>
                  </tr>
                ) : crawlPage?.content.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      조회된 크롤링 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  crawlPage?.content.map((crawl: CrawlItem) => (
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
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              openEditModal(crawl.coverLetterId, crawl.text)
                            }
                            disabled={updateCrawlMutation.isPending}
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                          >
                            수정
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-center">
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
          <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/90 py-4 backdrop-blur-sm">
            <div className="text-sm text-gray-700">
              전체 {crawlPage?.totalElements.toLocaleString() || 0}개 중{' '}
              {page * size + 1}-
              {Math.min((page + 1) * size, crawlPage?.totalElements || 0)} 개
              표시
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(0)}
                disabled={page === 0}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                처음
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-3 py-1 text-sm">
                {page + 1} / {crawlPage?.totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= (crawlPage?.totalPages || 1) - 1}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                다음
              </button>
              <button
                onClick={() =>
                  handlePageChange((crawlPage?.totalPages || 1) - 1)
                }
                disabled={page >= (crawlPage?.totalPages || 1) - 1}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                마지막
              </button>
              <select
                value={size}
                onChange={(e) => {
                  e.preventDefault();
                  const newSize = Number(e.target.value);
                  setSize(newSize);
                  setPage(0);
                  // 크롤링 탭에서는 즉시 실행 상태 업데이트
                  setCrawlExecutedSize(newSize);
                  setCrawlExecutedPage(0);
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
      )}

      {activeTab === 'extract' && (
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
                    e.preventDefault();
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
                    e.preventDefault();
                    setSortDirection(e.target.value as any);
                    setPage(0);
                  }}
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => {
                    e.preventDefault();
                    setCategory(e.target.value as any);
                  }}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value="">카테고리 선택</option>
                  <option value="EXPRESSION">표현</option>
                  <option value="STRUCTURE">구조</option>
                  <option value="CONTENT">내용</option>
                </select>
              </div>
            </div>

            <div className="col-start-4 flex items-end justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    resetFilters();
                  }}
                  className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  필터 초기화
                </button>
                <button
                  onClick={handleSearch}
                  className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  검색
                </button>
                <button
                  onClick={() =>
                    extractMutation.mutate(undefined, {
                      onSuccess: () => {
                        // refresh raw and final lists after extraction
                        currentExtractQuery.refetch();
                        currentFinalQuery.refetch();
                      },
                    })
                  }
                  disabled={extractMutation.isPending}
                  className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                  {extractMutation.isPending ? '특징 추출 중...' : '특징 추출'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    크롤링 ID
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    자기소개서 ID
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    카테고리
                  </th>
                  <th className="w-7/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    설명
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    생성일
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    수정일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentExtractQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        로딩 중...
                      </div>
                    </td>
                  </tr>
                ) : !currentExtractQuery.data ||
                  (currentExtractQuery.data.content &&
                    currentExtractQuery.data.content.length === 0) ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      조회된 데이터가 없습니다.
                      {category && (
                        <div className="mt-1 text-xs text-gray-400">
                          카테고리: {categoryLabel(category)}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentExtractQuery.data.content.map((item: any) => (
                    <tr
                      key={item.rawCoverLetterFeatureId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        #{item.rawCoverLetterFeatureId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {item.coverLetterId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-700">
                        {categoryLabel(item.featuresCategory) ||
                          item.featuresCategory}
                      </td>
                      <td className="truncate px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {currentExtractQuery.data &&
            currentExtractQuery.data.totalPages > 1 && (
              <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/90 py-4 backdrop-blur-sm">
                <div className="text-sm text-gray-700">
                  전체 {currentExtractQuery.data.totalElements.toLocaleString()}
                  개
                  {category && (
                    <span className="ml-2 text-xs text-blue-600">
                      (카테고리: {categoryLabel(category)})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(0)}
                    disabled={page === 0}
                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    처음
                  </button>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1 text-sm">
                    {page + 1} / {currentExtractQuery.data.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= currentExtractQuery.data.totalPages - 1}
                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    다음
                  </button>
                  <button
                    onClick={() =>
                      handlePageChange(currentExtractQuery.data.totalPages - 1)
                    }
                    disabled={page >= currentExtractQuery.data.totalPages - 1}
                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    마지막
                  </button>
                  <select
                    value={size}
                    onChange={(e) => {
                      e.preventDefault();
                      const newSize = Number(e.target.value);
                      setSize(newSize);
                      setPage(0);
                      setExtractExecutedSize(newSize);
                      setExtractExecutedPage(0);
                    }}
                    className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
                  >
                    <option value={5}>5개씩</option>
                    <option value={10}>10개씩</option>
                    <option value={20}>20개씩</option>
                  </select>
                </div>
              </div>
            )}
        </div>
      )}

      {activeTab === 'deduplication' && (
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
                    e.preventDefault();
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
                    e.preventDefault();
                    setSortDirection(e.target.value as any);
                    setPage(0);
                  }}
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => {
                    e.preventDefault();
                    setCategory(e.target.value as any);
                  }}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value="">카테고리 선택</option>
                  <option value="EXPRESSION">표현</option>
                  <option value="STRUCTURE">구조</option>
                  <option value="CONTENT">내용</option>
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
                  onClick={handleSearch}
                  className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  검색
                </button>
                <button
                  onClick={() =>
                    dedupMutation.mutate(undefined, {
                      onSuccess: () => {
                        // refetch both raw and final lists so UI updates
                        currentFinalQuery.refetch();
                        currentExtractQuery.refetch();
                      },
                    })
                  }
                  disabled={dedupMutation.isPending}
                  className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                  {dedupMutation.isPending
                    ? '중복 제거 중...'
                    : '중복 제거 실행'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    크롤링 ID
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    자기소개서 ID
                  </th>

                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    카테고리
                  </th>
                  <th className="w-6/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    설명
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    중복 수
                  </th>

                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    생성일
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    수정일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentFinalQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        로딩 중...
                      </div>
                    </td>
                  </tr>
                ) : !currentFinalQuery.data ||
                  (currentFinalQuery.data.content &&
                    currentFinalQuery.data.content.length === 0) ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      조회된 데이터가 없습니다.
                      {category && (
                        <div className="mt-1 text-xs text-gray-400">
                          카테고리: {categoryLabel(category)}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentFinalQuery.data.content.map((item: any) => (
                    <tr
                      key={item.coverLetterFeatureId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        #{item.coverLetterFeatureId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {item.representativeCoverLetterId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-700">
                        {categoryLabel(item.featuresCategory) ||
                          item.featuresCategory}
                      </td>
                      <td className="truncate px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {item.duplicateCount}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {currentFinalQuery.data && currentFinalQuery.data.totalPages > 1 && (
            <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/90 py-4 backdrop-blur-sm">
              <div className="text-sm text-gray-700">
                전체 {currentFinalQuery.data.totalElements.toLocaleString()}개
                {category && (
                  <span className="ml-2 text-xs text-blue-600">
                    (카테고리: {categoryLabel(category)})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  처음
                </button>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  이전
                </button>
                <span className="px-3 py-1 text-sm">
                  {page + 1} / {currentFinalQuery.data.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= currentFinalQuery.data.totalPages - 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  다음
                </button>
                <button
                  onClick={() =>
                    handlePageChange(currentFinalQuery.data.totalPages - 1)
                  }
                  disabled={page >= currentFinalQuery.data.totalPages - 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  마지막
                </button>
                <select
                  value={size}
                  onChange={(e) => {
                    e.preventDefault();
                    const newSize = Number(e.target.value);
                    setSize(newSize);
                    setPage(0);
                    setFinalExecutedSize(newSize);
                    setFinalExecutedPage(0);
                  }}
                  className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value={5}>5개씩</option>
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'crawling' && editModal.isOpen && (
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
