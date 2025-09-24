'use client';

import React, { useEffect, useState } from 'react';
import { useAdminResumes, useAdminCoverLetters } from '@/entities/admin';
import { useRestoreResume } from '@/features/restore-resumes';
import { useRestoreCoverLetter } from '@/features/restore-coverLetter';

export const AdminRestoreCombined = ({
  initialTab = 'resumes',
}: {
  initialTab?: 'resumes' | 'coverLetters';
}) => {
  const [activeTab, setActiveTab] = useState<'resumes' | 'coverLetters'>(
    initialTab,
  );

  // shared filter/UI state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({
    status: 'DELETED',
    email: '',
    title: '',
  } as {
    status: 'ACTIVE' | 'DELETED';
    email: string;
    title: string;
  });

  // executed (applied) state per-resource so UI changes don't immediately trigger fetch
  const [resumeExecuted, setResumeExecuted] = useState({
    page: 0,
    size: 10,
    status: 'DELETED',
    email: '',
    title: '',
  } as {
    page: number;
    size: number;
    status: 'ACTIVE' | 'DELETED';
    email: string;
    title: string;
  });

  const [coverExecuted, setCoverExecuted] = useState({
    page: 0,
    size: 10,
    status: 'DELETED',
    email: '',
    title: '',
  } as {
    page: number;
    size: number;
    status: 'ACTIVE' | 'DELETED';
    email: string;
    title: string;
  });

  // per-resource pagination info
  const [resumePageInfo, setResumePageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });
  const [coverPageInfo, setCoverPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  const {
    data: resumeData,
    isLoading: resumeLoading,
    refetch: refetchResumes,
  } = useAdminResumes({
    page: resumeExecuted.page,
    size: resumeExecuted.size,
    status: resumeExecuted.status,
    email: resumeExecuted.email || undefined,
    title: resumeExecuted.title || undefined,
  });

  const {
    data: coverData,
    isLoading: coverLoading,
    refetch: refetchCovers,
  } = useAdminCoverLetters({
    page: coverExecuted.page,
    size: coverExecuted.size,
    status: coverExecuted.status,
    email: coverExecuted.email || undefined,
    title: coverExecuted.title || undefined,
  });

  const resumeContent = resumeData?.content ?? [];
  const coverContent = coverData?.content ?? [];

  const restoreResume = useRestoreResume();
  const restoreCover = useRestoreCoverLetter();

  useEffect(() => {
    if (resumeData) {
      setResumePageInfo({
        totalElements: resumeData.totalElements,
        totalPages: resumeData.totalPages,
        currentPage: resumeExecuted.page,
        pageSize: resumeExecuted.size,
      });
    }
  }, [resumeData, resumeExecuted.page, resumeExecuted.size]);

  // when executed state changes, trigger refetch for the active tab
  useEffect(() => {
    if (activeTab === 'resumes') {
      refetchResumes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resumeExecuted.page,
    resumeExecuted.size,
    resumeExecuted.status,
    resumeExecuted.email,
    resumeExecuted.title,
    activeTab,
  ]);

  useEffect(() => {
    if (coverData) {
      setCoverPageInfo({
        totalElements: coverData.totalElements,
        totalPages: coverData.totalPages,
        currentPage: coverExecuted.page,
        pageSize: coverExecuted.size,
      });
    }
  }, [coverData, coverExecuted.page, coverExecuted.size]);

  useEffect(() => {
    if (activeTab === 'coverLetters') {
      refetchCovers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    coverExecuted.page,
    coverExecuted.size,
    coverExecuted.status,
    coverExecuted.email,
    coverExecuted.title,
    activeTab,
  ]);

  const handleRestoreResume = (id: number) => {
    if (!window.confirm('이력서를 복구하시겠습니까?')) return;
    restoreResume.mutate(id);
  };

  const handleRestoreCover = (id: number) => {
    if (!window.confirm('자소서를 복구하시겠습니까?')) return;
    restoreCover.mutate(id);
  };

  const resetFilters = () => {
    const cleared = { status: 'DELETED', email: '', title: '' } as const;
    setFilters({ status: 'DELETED', email: '', title: '' });
    setPage(0);
    setResumeExecuted({
      page: 0,
      size: 10,
      status: cleared.status,
      email: '',
      title: '',
    });
    setCoverExecuted({
      page: 0,
      size: 10,
      status: cleared.status,
      email: '',
      title: '',
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) return;
    setPage(newPage);
    if (activeTab === 'resumes') {
      setResumeExecuted((prev) => ({ ...prev, page: newPage }));
    } else {
      setCoverExecuted((prev) => ({ ...prev, page: newPage }));
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-800';
    if (status === 'DELETED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-black">복구 관리</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeTab === 'resumes') refetchResumes();
              else refetchCovers();
            }}
            className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>

      <div className="flex w-full border-b border-gray-300">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'resumes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => {
            setActiveTab('resumes');
            resetFilters();
          }}
        >
          이력서 복구
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'coverLetters' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => {
            setActiveTab('coverLetters');
            resetFilters();
          }}
        >
          자기소개서 복구
        </button>
      </div>

      {/* list area */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <option value="DELETED">삭제됨</option>
                <option value="ACTIVE">활성화</option>
              </select>
            </div>

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
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              필터 초기화
            </button>
            <button
              onClick={() => {
                // apply filters to active tab only
                if (activeTab === 'resumes') {
                  setResumeExecuted({
                    page: 0,
                    size,
                    status: filters.status,
                    email: filters.email,
                    title: filters.title,
                  });
                  setPage(0);
                } else {
                  setCoverExecuted({
                    page: 0,
                    size,
                    status: filters.status,
                    email: filters.email,
                    title: filters.title,
                  });
                  setPage(0);
                }
              }}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              검색
            </button>
          </div>
        </div>

        {activeTab === 'resumes' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    작성자
                  </th>
                  <th className="w-4/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    제목
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    생성일
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    삭제일
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {resumeLoading ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : resumeContent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      조회된 이력서가 없습니다.
                    </td>
                  </tr>
                ) : (
                  resumeContent.map((item: any) => (
                    <tr key={item.resumeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        #{item.resumeId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.authorEmail}
                      </td>
                      <td
                        className="truncate px-6 py-4 text-sm text-gray-900"
                        title={item.title}
                      >
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.deletedAt
                          ? new Date(item.deletedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <span
                          className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status === 'ACTIVE' ? '활성화' : '삭제됨'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <button
                          onClick={() => handleRestoreResume(item.resumeId)}
                          disabled={
                            item.status === 'ACTIVE' || restoreResume.isPending
                          }
                          className={`rounded px-3 py-1 text-sm font-medium ${item.status === 'ACTIVE' ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          복구
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* pagination */}
            <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/90 py-4 backdrop-blur-sm">
              <div className="text-sm text-gray-700">
                전체 {resumePageInfo.totalElements.toLocaleString()}개
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
                  {page + 1} / {resumePageInfo.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= resumePageInfo.totalPages - 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  다음
                </button>
                <button
                  onClick={() =>
                    handlePageChange(resumePageInfo.totalPages - 1)
                  }
                  disabled={page >= resumePageInfo.totalPages - 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  마지막
                </button>
                <select
                  value={size}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setSize(newSize);
                    setPage(0);
                    setResumeExecuted((prev) => ({
                      ...prev,
                      size: newSize,
                      page: 0,
                    }));
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
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    작성자
                  </th>
                  <th className="w-4/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    제목
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    생성일
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    삭제일
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {coverLoading ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : coverContent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      조회된 자기소개서가 없습니다.
                    </td>
                  </tr>
                ) : (
                  coverContent.map((item: any) => (
                    <tr key={item.coverLetterId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        #{item.coverLetterId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.authorEmail}
                      </td>
                      <td
                        className="truncate px-6 py-4 text-sm text-gray-900"
                        title={item.title}
                      >
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.deletedAt
                          ? new Date(item.deletedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <span
                          className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status === 'ACTIVE' ? '활성화' : '삭제됨'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <button
                          onClick={() => handleRestoreCover(item.coverLetterId)}
                          disabled={
                            item.status === 'ACTIVE' || restoreCover.isPending
                          }
                          className={`rounded px-3 py-1 text-sm font-medium ${item.status === 'ACTIVE' ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          복구
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* pagination */}
            <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/90 py-4 backdrop-blur-sm">
              <div className="text-sm text-gray-700">
                전체 {coverPageInfo.totalElements.toLocaleString()}개
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
                  {page + 1} / {coverPageInfo.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= coverPageInfo.totalPages - 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  다음
                </button>
                <button
                  onClick={() => handlePageChange(coverPageInfo.totalPages - 1)}
                  disabled={page >= coverPageInfo.totalPages - 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  마지막
                </button>
                <select
                  value={size}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setSize(newSize);
                    setPage(0);
                    setCoverExecuted((prev) => ({
                      ...prev,
                      size: newSize,
                      page: 0,
                    }));
                  }}
                  className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value={5}>5개씩</option>
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
