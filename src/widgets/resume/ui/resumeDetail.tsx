'use client';

import { useState } from 'react';
import { useResumeDetail, updateResume, deleteResume } from '@/entities/resume';
import type {
  Resume,
  ResumeSection,
  UpdateResumeRequest,
} from '@/entities/resume';
import { Button } from '@/shared/ui';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ResumeDetailProps {
  id: string;
}

export function ResumeDetail({ id }: ResumeDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Resume | null>(null);

  const queryClient = useQueryClient();
  const resumeId = parseInt(id);

  const { data: resumeResponse, isLoading, error } = useResumeDetail(resumeId);
  const resume = resumeResponse?.data;

  const updateMutation = useMutation({
    mutationFn: (data: UpdateResumeRequest) => updateResume(resumeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      setIsEditing(false);
      toast.success('이력서가 수정되었습니다.');
    },
    onError: () => {
      toast.error('이력서 수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteResume(resumeId),
    onSuccess: () => {
      toast.success('이력서가 삭제되었습니다.');
      window.location.href = '/resume';
    },
    onError: () => {
      toast.error('이력서 삭제에 실패했습니다.');
    },
  });

  const handleEdit = () => {
    if (resume) {
      setEditData({ ...resume });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editData) {
      updateMutation.mutate({
        title: editData.title,
        memberInfo: editData.memberInfo,
        sections: editData.sections,
      });
    }
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const updateTitle = (title: string) => {
    if (editData) {
      setEditData({ ...editData, title });
    }
  };

  const updateMemberInfo = (field: string, value: string) => {
    if (editData) {
      setEditData({
        ...editData,
        memberInfo: { ...editData.memberInfo, [field]: value },
      });
    }
  };

  const updateSection = (index: number, updatedSection: ResumeSection) => {
    if (editData) {
      const newSections = [...editData.sections];
      newSections[index] = updatedSection;
      setEditData({ ...editData, sections: newSections });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-red-600">이력서를 불러오는데 실패했습니다.</p>
        <Button
          onClick={() => (window.location.href = '/resume')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const displayData = isEditing ? editData : resume;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={editData?.title || ''}
              onChange={(e) => updateTitle(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-3xl font-bold text-gray-800"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">{resume.title}</h1>
          )}

          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  수정
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? '저장 중...' : '저장'}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  취소
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-600">
          작성일: {new Date(resume.createdAt).toLocaleDateString()}
          {resume.updatedAt !== resume.createdAt && (
            <span className="ml-4">
              수정일: {new Date(resume.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* 개인정보 섹션 */}
        <div className="mb-8 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">개인정보</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.memberInfo.name || ''}
                  onChange={(e) => updateMemberInfo('name', e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{displayData?.memberInfo.name}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                이메일
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData?.memberInfo.email || ''}
                  onChange={(e) => updateMemberInfo('email', e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{displayData?.memberInfo.email}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.memberInfo.phoneNumber || ''}
                  onChange={(e) =>
                    updateMemberInfo('phoneNumber', e.target.value)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">
                  {displayData?.memberInfo.phoneNumber || '-'}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                블로그 URL
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={editData?.memberInfo.blogUrl || ''}
                  onChange={(e) => updateMemberInfo('blogUrl', e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">
                  {displayData?.memberInfo.blogUrl || '-'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 이력서 섹션들 */}
        <div className="space-y-6">
          {displayData?.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {section.sectionTitle}
              </h3>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="border-l-4 border-blue-200 pl-4"
                  >
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    {item.subTitle && (
                      <p className="text-sm text-gray-600">{item.subTitle}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {item.startDate} - {item.endDate}
                    </p>
                    <p className="mt-2 text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
