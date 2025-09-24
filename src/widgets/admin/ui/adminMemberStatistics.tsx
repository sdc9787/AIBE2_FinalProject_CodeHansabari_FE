'use client';

import React, { useState, useEffect } from 'react';
import {
  useAdminMemberStatistics,
  useAdminMembers,
  type AdminMemberItem,
} from '@/entities/admin';
import {
  useChangeMemberStatus,
  useChangeMemberRole,
  useForceLogoutMember,
} from '@/features';
import { useUserStore } from '@/shared';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export const AdminMemberStatistics = () => {
  const { data, isLoading, error, refetch } = useAdminMemberStatistics();

  // Member management state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // pendingFilters are updated by UI controls but do NOT trigger fetching.
  // appliedFilters are what the API query uses. We only apply pendingFilters
  // (and trigger a fetch) when the user hits 검색, on initial apply,
  // on page change, or on page size change.
  const [pendingFilters, setPendingFilters] = useState<{
    role: 'USER' | 'ADMIN' | 'ROOT' | 'ALL';
    status: 'ACTIVE' | 'INACTIVE' | 'ALL';
    email: string;
    name: string;
    sortBy: 'createdAt' | 'lastLoginAt' | 'email' | 'name';
    sortDirection: 'asc' | 'desc';
  }>({
    role: 'ALL',
    status: 'ALL',
    email: '',
    name: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  const [appliedFilters, setAppliedFilters] =
    useState<typeof pendingFilters>(pendingFilters);

  // 페이지네이션 정보
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  // Modals removed - inline controls used instead

  const formatFilterForApi = (key: string, value: string) =>
    value === 'ALL' ? undefined : value;

  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useAdminMembers({
    page,
    size,
    role: formatFilterForApi('role', appliedFilters.role) as any,
    status: formatFilterForApi('status', appliedFilters.status) as any,
    email: appliedFilters.email || undefined,
    name: appliedFilters.name || undefined,
    sortBy: appliedFilters.sortBy,
    sortDirection: appliedFilters.sortDirection,
  });

  const content = membersData?.content ?? [];

  const changeMemberStatusMutation = useChangeMemberStatus();
  const changeMemberRoleMutation = useChangeMemberRole();
  const forceLogoutMutation = useForceLogoutMember();

  const stats = data;

  // 페이지네이션 업데이트
  useEffect(() => {
    if (membersData) {
      setPageInfo({
        totalElements: membersData.totalElements,
        totalPages: membersData.totalPages,
        currentPage: membersData.number,
        pageSize: membersData.size,
      });
    }
  }, [membersData]);

  // 전체 통계 계산
  const totalMembers =
    (stats?.activeMembers ?? 0) + (stats?.inactiveMembers ?? 0);
  // 검색 초기화
  const handleClearFilters = () => {
    const cleared = {
      role: 'ALL',
      status: 'ALL',
      email: '',
      name: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    } as const;
    setPendingFilters(cleared as any);
    setAppliedFilters(cleared as any);
    setPage(0);
    // refetch with cleared filters
    setTimeout(() => refetchMembers(), 0);
  };

  // 검색 처리
  const handleSearch = () => {
    // apply pending filters and fetch
    setAppliedFilters(pendingFilters);
    setPage(0);
    setTimeout(() => refetchMembers(), 0);
  };

  // Modal-based handlers removed; inline controls use mutation hooks directly

  // 회원 단위 업데이트 helpers (used by inline selects/buttons)
  const { user: currentUser } = useUserStore();

  const updateMemberStatus = async (
    memberId: number,
    newStatus: 'ACTIVE' | 'INACTIVE',
  ) => {
    const member = content.find((m) => m.memberId === memberId);
    if (!member) return;

    // prevent changing own status
    if (currentUser?.email && currentUser.email === member.email) {
      alert('자기 자신의 상태는 변경할 수 없습니다.');
      return;
    }

    const myRole = (currentUser?.role ?? 'USER') as 'USER' | 'ADMIN' | 'ROOT';
    // ADMIN can only change USER status
    if (myRole === 'ADMIN' && member.role !== 'USER') {
      alert('관리자는 다른 관리자나 최고관리자의 상태를 변경할 수 없습니다.');
      return;
    }

    try {
      await changeMemberStatusMutation.mutateAsync({
        memberId,
        data: { status: newStatus, reason: `상태 변경: ${newStatus}` },
      });
      refetchMembers();
      refetch();
    } catch (err) {
      console.error('Status change failed:', err);
    }
  };

  const updateMemberRole = async (
    memberId: number,
    newRole: 'USER' | 'ADMIN' | 'ROOT',
  ) => {
    const member = content.find((m) => m.memberId === memberId);
    if (!member) return;

    // cannot change own role
    if (currentUser?.email && currentUser.email === member.email) {
      alert('자기 자신의 역할은 변경할 수 없습니다.');
      return;
    }

    const myRole = currentUser?.role ?? 'USER';

    // Only ROOT can grant ROOT
    if (newRole === 'ROOT' && myRole !== 'ROOT') {
      alert('ROOT 권한 부여는 ROOT 관리자만 가능합니다.');
      return;
    }

    // prevent same-level admin role changes
    if (myRole === 'ADMIN' && member.role === 'ADMIN') {
      alert('동급 관리자끼리는 역할 변경이 불가능합니다.');
      return;
    }

    if (myRole === 'ROOT' && member.role === 'ROOT') {
      alert('동급 관리자끼리는 역할 변경이 불가능합니다.');
      return;
    }

    try {
      await changeMemberRoleMutation.mutateAsync({
        memberId,
        data: { role: newRole, reason: `역할 변경: ${newRole}` },
      });
      refetchMembers();
      refetch();
    } catch (err) {
      console.error('Role change failed:', err);
    }
  };

  const forceLogoutMember = async (memberId: number) => {
    try {
      await forceLogoutMutation.mutateAsync(memberId);
      refetchMembers();
    } catch (err) {
      console.error('Force logout failed:', err);
    }
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // 상태별 회원 수 도넛 차트 데이터
  const statusChartData = stats
    ? {
        labels: ['활성', '비활성'],
        datasets: [
          {
            data: [stats.activeMembers || 0, stats.inactiveMembers || 0],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 191, 36, 0.8)',
            ],
            borderColor: ['rgba(34, 197, 94, 1)', 'rgba(251, 191, 36, 1)'],
            borderWidth: 2,
          },
        ],
      }
    : null;

  // 신규 가입 통계 (도넛) 데이터
  const signupDonutData = stats
    ? {
        labels: ['오늘', '이번 달'],
        datasets: [
          {
            data: [stats.todayNewMembers || 0, stats.monthlyNewMembers || 0],
            // modern signup palette: indigo / cyan
            backgroundColor: ['rgba(79,70,229,0.9)', 'rgba(6,182,212,0.9)'],
            borderColor: ['rgba(79,70,229,1)', 'rgba(6,182,212,1)'],
            borderWidth: 2,
          },
        ],
      }
    : null;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-gray-500">통계 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <span className="text-red-500">
          통계 데이터를 불러오는데 실패했습니다.
        </span>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-gray-500">통계 데이터가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-black">회원 통계 및 관리</h1>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
              <span className="text-xs text-blue-600">전체</span>
              <span className="text-sm font-semibold text-blue-700">
                {(stats.totalMembers || 0).toLocaleString()}명
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
              <span className="text-xs text-green-600">활성화율</span>
              <span className="text-sm font-semibold text-green-700">
                {stats.totalMembers
                  ? (
                      ((stats.activeMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </span>
            </div>
            {/* 역할별 회원수를 헤더 옆으로 표시 */}
            <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5">
              <span className="text-xs text-gray-600">사용자</span>
              <span className="text-sm font-semibold text-gray-700">
                {(stats.userRoleCount || 0).toLocaleString()}명
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
              <span className="text-xs text-blue-600">관리자</span>
              <span className="text-sm font-semibold text-blue-700">
                {(stats.adminRoleCount || 0).toLocaleString()}명
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5">
              <span className="text-xs text-purple-600">최고 관리자</span>
              <span className="text-sm font-semibold text-purple-700">
                {(stats.rootRoleCount || 0).toLocaleString()}명
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>

      {/* 기본 정보 및 차트 섹션 */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 신규 가입 통계 (도넛) */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            신규 가입 통계
          </h2>
          {signupDonutData && (
            <div className="flex h-60 items-center justify-center">
              <Doughnut data={signupDonutData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* 상태별 회원 수 도넛 차트 */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            상태별 회원 분포
          </h2>
          {statusChartData && (
            <div className="flex h-60 items-center justify-center">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* 회원 관리 섹션 */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">회원 관리</h2>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 이메일 검색 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              value={pendingFilters.email}
              onChange={(e) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="이메일 검색"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 이름 검색 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              value={pendingFilters.name}
              onChange={(e) =>
                setPendingFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="이름 검색"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 역할 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              역할
            </label>
            <select
              value={pendingFilters.role}
              onChange={(e) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  role: e.target.value as any,
                }))
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">전체</option>
              <option value="USER">사용자</option>
              <option value="ADMIN">관리자</option>
              <option value="ROOT">최고 관리자</option>
            </select>
          </div>

          {/* 상태 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              상태
            </label>
            <select
              value={pendingFilters.status}
              onChange={(e) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  status: e.target.value as any,
                }))
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">전체</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>
        </div>

        {/* 정렬 및 액션 버튼 */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <select
              value={`${pendingFilters.sortBy}-${pendingFilters.sortDirection}`}
              onChange={(e) => {
                const [sortBy, sortDirection] = e.target.value.split('-');
                setPendingFilters((prev) => ({
                  ...prev,
                  sortBy: sortBy as any,
                  sortDirection: sortDirection as any,
                }));
              }}
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="createdAt-desc">가입일 (최신순)</option>
              <option value="createdAt-asc">가입일 (오래된순)</option>
              <option value="lastLoginAt-desc">최종 로그인 (최신순)</option>
              <option value="lastLoginAt-asc">최종 로그인 (오래된순)</option>
              <option value="email-asc">이메일 (오름차순)</option>
              <option value="email-desc">이메일 (내림차순)</option>
              <option value="name-asc">이름 (오름차순)</option>
              <option value="name-desc">이름 (내림차순)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
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
          </div>
        </div>

        {/* 회원 목록 */}
        {membersLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : membersError ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <span className="text-red-500">
              회원 목록을 불러오는데 실패했습니다.
            </span>
            <button
              onClick={() => refetchMembers()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    회원 정보
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    역할
                  </th>
                  <th className="w-1/12 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="w-1/8 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    최종 로그인
                  </th>
                  <th className="w-1/8 px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    가입일
                  </th>
                  <th className="w-1/4 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {content.map((member: AdminMemberItem) => (
                  <tr key={member.memberId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex min-w-0 items-center">
                        <div className="mr-3 flex-shrink-0 text-xs text-gray-500">
                          #{member.memberId}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="truncate text-sm text-gray-500">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* 가입일 */}
                    {/* (moved) 가입일 will be rendered after 최종 로그인 */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-sm px-2 py-1 text-xs leading-5 font-semibold ${
                          member.role === 'ROOT'
                            ? 'bg-purple-100 text-purple-800'
                            : member.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.role === 'ROOT'
                          ? '최고 관리자'
                          : member.role === 'ADMIN'
                            ? '관리자'
                            : '사용자'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-sm px-2 py-1 text-xs leading-5 font-semibold ${
                          member.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {member.status === 'ACTIVE' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                      {member.lastLoginAt
                        ? new Date(member.lastLoginAt).toLocaleDateString()
                        : '로그인 기록 없음'}
                    </td>
                    {/* 가입일 (moved) */}
                    <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-600">
                      {member.createdAt
                        ? new Date(member.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {(() => {
                          const isSelf = currentUser?.email === member.email;
                          const myRole = (currentUser?.role ?? 'USER') as
                            | 'USER'
                            | 'ADMIN'
                            | 'ROOT';

                          // status change rules
                          const canChangeStatus =
                            !isSelf &&
                            (myRole === 'ROOT' ||
                              (myRole === 'ADMIN' && member.role === 'USER'));
                          const statusTitle = isSelf
                            ? '자기 자신의 상태는 변경할 수 없습니다.'
                            : myRole === 'ADMIN' && member.role !== 'USER'
                              ? '관리자는 사용자만 상태 변경이 가능합니다.'
                              : '';

                          // role change rules
                          const canChangeRole =
                            !isSelf &&
                            !(myRole === 'ADMIN' && member.role === 'ADMIN') &&
                            !(myRole === 'ROOT' && member.role === 'ROOT');
                          const roleTitle = isSelf
                            ? '자기 자신의 역할은 변경할 수 없습니다.'
                            : myRole === 'ADMIN' && member.role === 'ADMIN'
                              ? '동급 관리자끼리는 역할 변경 불가'
                              : myRole === 'ROOT' && member.role === 'ROOT'
                                ? '동급 관리자끼리는 역할 변경 불가'
                                : '';

                          return (
                            <>
                              <select
                                value={member.status}
                                onChange={(e) =>
                                  updateMemberStatus(
                                    member.memberId,
                                    e.target.value as any,
                                  )
                                }
                                className="rounded border px-2 py-1 text-sm"
                                aria-label={`Change status for ${member.name}`}
                                disabled={!canChangeStatus}
                                title={statusTitle}
                              >
                                <option value="ACTIVE">활성</option>
                                <option value="INACTIVE">비활성</option>
                              </select>

                              <select
                                value={member.role}
                                onChange={(e) =>
                                  updateMemberRole(
                                    member.memberId,
                                    e.target.value as any,
                                  )
                                }
                                className="rounded border px-2 py-1 text-sm"
                                aria-label={`Change role for ${member.name}`}
                                disabled={!canChangeRole}
                                title={roleTitle}
                              >
                                <option value="USER">사용자</option>
                                <option value="ADMIN">관리자</option>
                                <option value="ROOT">최고 관리자</option>
                              </select>
                            </>
                          );
                        })()}

                        <button
                          onClick={() => {
                            if (
                              !confirm(
                                `${member.name} 회원을 강제 로그아웃 하시겠습니까?`,
                              )
                            )
                              return;
                            void forceLogoutMember(member.memberId);
                          }}
                          className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                          aria-label={`Force logout ${member.name}`}
                        >
                          로그아웃
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {content.length > 0 && (
          <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white/90 py-4 backdrop-blur-sm">
            <div className="text-sm text-gray-700">
              전체 {pageInfo.totalElements.toLocaleString()}개 중{' '}
              {pageInfo.currentPage * pageInfo.pageSize + 1}-
              {Math.min(
                (pageInfo.currentPage + 1) * pageInfo.pageSize,
                pageInfo.totalElements,
              )}
              개 표시
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPage(0);
                  setTimeout(() => refetchMembers(), 0);
                }}
                disabled={pageInfo.currentPage === 0}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                처음
              </button>
              <button
                onClick={() => {
                  setPage((p) => p - 1);
                  setTimeout(() => refetchMembers(), 0);
                }}
                disabled={pageInfo.currentPage === 0}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-3 py-1 text-sm">
                {pageInfo.currentPage + 1} / {pageInfo.totalPages}
              </span>
              <button
                onClick={() => {
                  setPage((p) => p + 1);
                  setTimeout(() => refetchMembers(), 0);
                }}
                disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
                className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                다음
              </button>
              <button
                onClick={() => {
                  setPage(pageInfo.totalPages - 1);
                  setTimeout(() => refetchMembers(), 0);
                }}
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
                  setTimeout(() => refetchMembers(), 0);
                }}
                className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
                <option value={50}>50개씩</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Modals removed: replaced by inline selects/buttons */}
    </div>
  );
};
