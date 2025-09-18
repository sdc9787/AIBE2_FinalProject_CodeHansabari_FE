'use client';

import React, { useState, useEffect } from 'react';
import { useAdminMembers, type AdminMemberItem } from '@/entities/admin';
import {
  useChangeMemberStatus,
  useChangeMemberRole,
  useForceLogoutMember,
} from '@/features';

export const AdminMembers = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<{
    role: 'USER' | 'ADMIN' | 'ROOT' | 'ALL';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ALL';
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

  // 페이지네이션 정보
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  // 모달 상태
  const [modals, setModals] = useState({
    changeStatus: { isOpen: false, memberId: 0, currentStatus: '' },
    changeRole: { isOpen: false, memberId: 0, currentRole: '' },
    forceLogout: { isOpen: false, memberId: 0, memberName: '' },
  });

  const formatFilterForApi = (key: string, value: string) =>
    value === 'ALL' ? undefined : value;

  const {
    data,
    isLoading: queryLoading,
    error,
    refetch,
  } = useAdminMembers({
    page,
    size,
    role: formatFilterForApi('role', filters.role) as any,
    status: formatFilterForApi('status', filters.status) as any,
    email: filters.email || undefined,
    name: filters.name || undefined,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  });

  const content = data?.content ?? [];

  const changeMemberStatusMutation = useChangeMemberStatus();
  const changeMemberRoleMutation = useChangeMemberRole();
  const forceLogoutMutation = useForceLogoutMember();

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

  const resetFilters = () => {
    setFilters({
      role: 'ALL',
      status: 'ALL',
      email: '',
      name: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
    setPage(0);
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-800';
    if (status === 'INACTIVE') return 'bg-yellow-100 text-yellow-800';
    if (status === 'SUSPENDED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 역할별 색상
  const getRoleColor = (role: string) => {
    if (role === 'ROOT') return 'bg-purple-100 text-purple-800';
    if (role === 'ADMIN') return 'bg-blue-100 text-blue-800';
    if (role === 'USER') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 모달 열기/닫기 함수들
  const openChangeStatusModal = (memberId: number, currentStatus: string) => {
    setModals((prev) => ({
      ...prev,
      changeStatus: { isOpen: true, memberId, currentStatus },
    }));
  };

  const openChangeRoleModal = (memberId: number, currentRole: string) => {
    setModals((prev) => ({
      ...prev,
      changeRole: { isOpen: true, memberId, currentRole },
    }));
  };

  const openForceLogoutModal = (memberId: number, memberName: string) => {
    setModals((prev) => ({
      ...prev,
      forceLogout: { isOpen: true, memberId, memberName },
    }));
  };

  const closeAllModals = () => {
    setModals({
      changeStatus: { isOpen: false, memberId: 0, currentStatus: '' },
      changeRole: { isOpen: false, memberId: 0, currentRole: '' },
      forceLogout: { isOpen: false, memberId: 0, memberName: '' },
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll">
      <h1 className="text-xl font-bold text-black">회원 관리</h1>

      {/* 필터 섹션 */}
      <div className="w-full rounded-sm border border-gray-300 bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 역할 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              역할
            </label>
            <select
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              value={filters.role}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  role: e.target.value as any,
                }))
              }
            >
              <option value="ALL">전체</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ROOT">ROOT</option>
            </select>
          </div>

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
              <option value="ALL">전체</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          {/* 이메일 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              이메일
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

          {/* 이름 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              placeholder="이름 부분 검색"
              value={filters.name}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, name: e.target.value }));
                setPage(0);
              }}
            />
          </div>

          {/* 정렬 기준 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              정렬 기준
            </label>
            <select
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
            >
              <option value="createdAt">생성일</option>
              <option value="lastLoginAt">최근 로그인</option>
              <option value="email">이메일</option>
              <option value="name">이름</option>
            </select>
          </div>

          {/* 정렬 방향 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              정렬 방향
            </label>
            <select
              className="w-full rounded-sm border border-gray-300 px-3 py-1"
              value={filters.sortDirection}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortDirection: e.target.value as any,
                }))
              }
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
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

      {/* 회원 리스트 */}
      <div className="w-full rounded-sm border border-gray-300 bg-white">
        {/* 헤더 */}
        <div className="grid grid-cols-[0.5fr_1fr_1fr_0.8fr_0.8fr_1fr_1fr_1.5fr] font-bold text-gray-700">
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            ID
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            이메일
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            이름
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            역할
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            상태
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            최근 로그인
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            가입일
          </div>
          <div className="flex h-12 items-center justify-center border-b border-gray-300 bg-gray-50 px-2">
            작업
          </div>

          {/* 데이터 */}
          {queryLoading ? (
            <div className="col-span-8 flex h-20 items-center justify-center">
              <span className="text-gray-500">로딩 중...</span>
            </div>
          ) : content.length === 0 ? (
            <div className="col-span-8 flex h-20 items-center justify-center">
              <span className="text-gray-500">조회된 회원이 없습니다.</span>
            </div>
          ) : (
            <>
              {content.map((item: AdminMemberItem) => (
                <React.Fragment key={item.memberId}>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    {item.memberId}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    <span className="truncate" title={item.email}>
                      {item.email}
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {item.name}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getRoleColor(item.role)}`}
                    >
                      {item.role}
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {item.lastLoginAt
                      ? new Date(item.lastLoginAt).toLocaleDateString()
                      : '-'}
                  </div>
                  <div className="flex h-16 items-center justify-center border-b border-gray-200 px-2 text-sm transition-colors hover:bg-blue-50">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : '-'}
                  </div>
                  <div className="flex h-16 items-center justify-center gap-1 border-b border-gray-200 px-2 transition-colors hover:bg-blue-50">
                    <button
                      onClick={() =>
                        openChangeStatusModal(item.memberId, item.status)
                      }
                      className="rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-700"
                    >
                      상태변경
                    </button>
                    <button
                      onClick={() =>
                        openChangeRoleModal(item.memberId, item.role)
                      }
                      className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      역할변경
                    </button>
                    <button
                      onClick={() =>
                        openForceLogoutModal(item.memberId, item.name)
                      }
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      강제로그아웃
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

      {/* 상태 변경 모달 */}
      {modals.changeStatus.isOpen && (
        <ChangeStatusModal
          memberId={modals.changeStatus.memberId}
          currentStatus={modals.changeStatus.currentStatus}
          onClose={closeAllModals}
          mutation={changeMemberStatusMutation}
        />
      )}

      {/* 역할 변경 모달 */}
      {modals.changeRole.isOpen && (
        <ChangeRoleModal
          memberId={modals.changeRole.memberId}
          currentRole={modals.changeRole.currentRole}
          onClose={closeAllModals}
          mutation={changeMemberRoleMutation}
        />
      )}

      {/* 강제 로그아웃 모달 */}
      {modals.forceLogout.isOpen && (
        <ForceLogoutModal
          memberId={modals.forceLogout.memberId}
          memberName={modals.forceLogout.memberName}
          onClose={closeAllModals}
          mutation={forceLogoutMutation}
        />
      )}
    </div>
  );
};

// 상태 변경 모달 컴포넌트
const ChangeStatusModal = ({
  memberId,
  currentStatus,
  onClose,
  mutation,
}: any) => {
  const [status, setStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('변경 사유를 입력해주세요.');
      return;
    }
    mutation.mutate(
      { memberId, data: { status, reason } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-bold">회원 상태 변경</h3>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">변경 사유</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-20 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="변경 사유를 입력해주세요"
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
            {mutation.isPending ? '변경 중...' : '변경'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 역할 변경 모달 컴포넌트
const ChangeRoleModal = ({ memberId, currentRole, onClose, mutation }: any) => {
  const [role, setRole] = useState(currentRole);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('변경 사유를 입력해주세요.');
      return;
    }
    mutation.mutate(
      { memberId, data: { role, reason } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-bold">회원 역할 변경</h3>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">역할</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ROOT">ROOT</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">변경 사유</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-20 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="변경 사유를 입력해주세요"
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
            {mutation.isPending ? '변경 중...' : '변경'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 강제 로그아웃 모달 컴포넌트
const ForceLogoutModal = ({ memberId, memberName, onClose, mutation }: any) => {
  const handleSubmit = () => {
    mutation.mutate(memberId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-bold">강제 로그아웃</h3>

        <p className="mb-4 text-gray-700">
          <strong>{memberName}</strong> 회원을 강제로 로그아웃시키겠습니까?
        </p>

        <p className="mb-4 text-sm text-red-600">
          해당 사용자의 모든 세션이 무효화되며, 즉시 로그아웃됩니다.
        </p>

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
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {mutation.isPending ? '처리 중...' : '강제 로그아웃'}
          </button>
        </div>
      </div>
    </div>
  );
};
