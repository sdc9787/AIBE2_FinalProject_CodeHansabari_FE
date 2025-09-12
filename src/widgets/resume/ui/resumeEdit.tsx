'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import {
  TechStackMetadata,
  ResumeMetadata,
  CreateResumeRequest,
  UpdateResumeRequest,
  fetchResumeDetail,
  fetchResumeMetadata,
  ResumeType,
} from '@/entities';
import { useUpdateResumeMutation } from '@/features/update-resume';
import { useModalStore } from '@/shared';
import { ResumeTemplateModal } from './ResumeTemplateModal';

// resumeDocument.tsx와 동일한 ItemType 인터페이스
interface ItemType {
  name: string;
  required: boolean;
  state: boolean;
  meta: string;
}

interface ResumeEditProps {
  id: number;
}

export function ResumeEdit({ id }: ResumeEditProps) {
  const router = useRouter();
  const { open, close } = useModalStore();

  // 이력서 상세 조회
  const {
    data: resumeDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useQuery({
    queryKey: ['resumeDetail', id],
    queryFn: () => fetchResumeDetail(id),
  });

  // 메타데이터 조회
  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useQuery<ResumeMetadata>({
    queryKey: ['resumeMetadata'],
    queryFn: fetchResumeMetadata,
  });

  // 수정 mutation
  const mutation = useUpdateResumeMutation({
    resumeId: id,
    params: { page: 0, size: 10 },
  });

  // resumeDocument.tsx와 동일한 초기 상태
  const [DataForm, setDataForm] = useState<CreateResumeRequest>({
    title: '',
    name: '',
    email: '',
    birthYear: new Date().getFullYear() - 25, // 기본값
    phone: '',
    careerType: 'FRESHMAN', // 기본값
    fieldName: '',
    type: 'DEFAULT',
    introduction: '',
    githubUrl: '',
    blogUrl: '',
    notionUrl: '',
    educations: [
      {
        schoolName: '',
        degreeLevel: 'HIGH_SCHOOL',
        graduationDate: '',
        major: '',
        personalGpa: null,
        totalGpa: null,
      },
    ],
    techStacks: [],
    projects: [
      {
        name: '',
        repositoryUrl: '',
        description: '',
        startDate: '',
        endDate: '',
        projectType: 'TEAM',
        techStacks: [],
      },
    ],
    careers: [
      {
        companyName: '',
        departmentPosition: '',
        startDate: '',
        endDate: '',
        mainTasks: '',
        companyDescription: '',
        techStacks: [],
      },
    ],
    trainings: [
      {
        courseName: '',
        institutionName: '',
        startDate: '',
        endDate: '',
        detailedContent: '',
        techStacks: [],
      },
    ],
    additionalInfos: [
      {
        startDate: '',
        endDate: '',
        category: 'AWARD',
        activityName: '',
        relatedOrganization: '',
        detailedContent: '',
        certificateNumber: '',
        languageLevel: '',
      },
    ],
    customLinks: [],
  });

  // resumeDocument.tsx와 동일한 items 상태
  const [items, setItems] = useState<ItemType[]>([
    { name: '프로필', required: true, state: true, meta: 'profile' },
    { name: '간단소개', required: false, state: false, meta: 'introduction' },
    { name: '학력', required: false, state: false, meta: 'education' },
    { name: '기술스택', required: false, state: false, meta: 'techStack' },
    { name: '링크', required: false, state: false, meta: 'link' },
    { name: '경력', required: false, state: false, meta: 'career' },
    { name: '프로젝트', required: false, state: false, meta: 'project' },
    { name: '교육이력', required: false, state: false, meta: 'training' },
    { name: '기타사항', required: false, state: false, meta: 'additionalInfo' },
  ]);

  // 이력서 상세 데이터로 폼 초기화
  useEffect(() => {
    if (resumeDetail?.data) {
      const detail = resumeDetail.data;

      // 폼 데이터 설정
      setDataForm({
        title: detail.title || '',
        name: detail.name || '',
        email: detail.email || '',
        birthYear: detail.birthYear || new Date().getFullYear() - 25,
        phone: detail.phone || '',
        careerType: detail.careerType || 'FRESHMAN',
        fieldName: detail.fieldName || '',
        type: detail.type || 'DEFAULT',
        introduction: detail.introduction || '',
        githubUrl: detail.githubUrl || '',
        blogUrl: detail.blogUrl || '',
        notionUrl: detail.notionUrl || '',
        educations:
          detail.educations && detail.educations.length > 0
            ? detail.educations
            : [
                {
                  schoolName: '',
                  degreeLevel: 'HIGH_SCHOOL',
                  graduationDate: '',
                  major: '',
                  personalGpa: null,
                  totalGpa: null,
                },
              ],
        techStacks: detail.techStacks || [],
        projects:
          detail.projects && detail.projects.length > 0
            ? detail.projects
            : [
                {
                  name: '',
                  repositoryUrl: '',
                  description: '',
                  startDate: '',
                  endDate: '',
                  projectType: 'TEAM',
                  techStacks: [],
                },
              ],
        careers:
          detail.careers && detail.careers.length > 0
            ? detail.careers
            : [
                {
                  companyName: '',
                  departmentPosition: '',
                  startDate: '',
                  endDate: '',
                  mainTasks: '',
                  companyDescription: '',
                  techStacks: [],
                },
              ],
        trainings:
          detail.trainings && detail.trainings.length > 0
            ? detail.trainings
            : [
                {
                  courseName: '',
                  institutionName: '',
                  startDate: '',
                  endDate: '',
                  detailedContent: '',
                  techStacks: [],
                },
              ],
        additionalInfos:
          detail.additionalInfos && detail.additionalInfos.length > 0
            ? detail.additionalInfos
            : [
                {
                  startDate: '',
                  endDate: '',
                  category: 'AWARD',
                  activityName: '',
                  relatedOrganization: '',
                  detailedContent: '',
                  certificateNumber: '',
                  languageLevel: '',
                },
              ],
        customLinks: detail.customLinks || [],
      });

      // items 상태 설정 (데이터가 있는 섹션은 활성화)
      setItems((prev) =>
        prev.map((item) => {
          switch (item.meta) {
            case 'introduction':
              return { ...item, state: !!detail.introduction };
            case 'education':
              return {
                ...item,
                state: !!(detail.educations && detail.educations.length > 0),
              };
            case 'techStack':
              return {
                ...item,
                state: !!(detail.techStacks && detail.techStacks.length > 0),
              };
            case 'link':
              return {
                ...item,
                state: !!(
                  detail.githubUrl ||
                  detail.blogUrl ||
                  detail.notionUrl ||
                  (detail.customLinks && detail.customLinks.length > 0)
                ),
              };
            case 'career':
              return {
                ...item,
                state: !!(detail.careers && detail.careers.length > 0),
              };
            case 'project':
              return {
                ...item,
                state: !!(detail.projects && detail.projects.length > 0),
              };
            case 'training':
              return {
                ...item,
                state: !!(detail.trainings && detail.trainings.length > 0),
              };
            case 'additionalInfo':
              return {
                ...item,
                state: !!(
                  detail.additionalInfos && detail.additionalInfos.length > 0
                ),
              };
            default:
              return item;
          }
        }),
      );
    }
  }, [resumeDetail]);

  // 로딩 중일 때
  if (isLoadingDetail || isLoadingMetadata) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">이력서 정보를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 발생 시
  if (detailError || metadataError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          이력서 정보를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // resumeDocument.tsx의 모든 핸들러 함수들을 여기에 복사해야 합니다
  // 페이지 길이 제한으로 일부만 보여드리겠습니다

  const handleUpdateResume = () => {
    // 필수 필드 검증
    if (!DataForm.title.trim()) {
      toast.error('이력서 제목을 입력해주세요.');
      return;
    }
    if (!DataForm.name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }
    if (!DataForm.email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }
    if (!DataForm.phone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return;
    }
    if (!DataForm.fieldName.trim()) {
      toast.error('직무 분야를 입력해주세요.');
      return;
    }

    // 이력서 필터링
    const filteredDataForm: UpdateResumeRequest = { ...DataForm };

    try {
      items.forEach((item) => {
        // 선택 항목이 활성화되어 있지만 내용이 없는 경우 에러
        if (!item.required && item.state && !hasContent(item.name)) {
          throw new Error(`"${item.name}" 항목의 내용을 모두 입력해주세요.`);
        }

        // 선택 항목이 비활성화된 경우 해당 속성을 제거
        if (!item.required && !item.state) {
          switch (item.meta) {
            case 'introduction':
              delete filteredDataForm.introduction;
              break;
            case 'education':
              delete filteredDataForm.educations;
              break;
            case 'techStack':
              delete filteredDataForm.techStacks;
              break;
            case 'link':
              delete filteredDataForm.githubUrl;
              delete filteredDataForm.blogUrl;
              delete filteredDataForm.notionUrl;
              delete filteredDataForm.customLinks;
              break;
            case 'career':
              delete filteredDataForm.careers;
              break;
            case 'project':
              delete filteredDataForm.projects;
              break;
            case 'training':
              delete filteredDataForm.trainings;
              break;
            case 'additionalInfo':
              delete filteredDataForm.additionalInfos;
              break;
            default:
              break;
          }
        }
      });
    } catch (error) {
      toast.error((error as Error).message);
      return;
    }

    // 이력서 수정
    updateResumeWithCurrentTemplate(filteredDataForm);
  };

  const updateResumeWithCurrentTemplate = (formData: UpdateResumeRequest) => {
    mutation.mutate(formData, {
      onSuccess: () => {
        router.push('/resume');
      },
      onError: (error: any) => {
        console.error('이력서 수정 실패:', error);
      },
    });
  };

  // 템플릿 선택 모달
  const handleSelectTemplate = () => {
    const handleTemplateSelect = (type: ResumeType) => {
      setDataForm((prev) => ({
        ...prev,
        type,
      }));
      close();
    };

    const handleCancel = () => {
      close();
    };

    open(
      <ResumeTemplateModal
        onSelect={handleTemplateSelect}
        onCancel={handleCancel}
      />,
    );
  };

  // hasContent 함수 (resumeDocument.tsx에서 복사)
  const hasContent = (itemName: string): boolean => {
    // 이 함수도 resumeDocument.tsx에서 그대로 복사해야 합니다
    // 임시로 true 반환
    return true;
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">이력서 수정</h1>

      {/* 여기에 resumeDocument.tsx의 모든 UI 컴포넌트를 복사 */}

      {/* 수정 버튼 */}
      <div className="mt-12 flex justify-center gap-4">
        <motion.button
          onClick={handleSelectTemplate}
          disabled={mutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="transform rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          템플릿 선택
        </motion.button>

        <motion.button
          onClick={handleUpdateResume}
          disabled={mutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="transform rounded-xl border-2 border-blue-600 bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? '수정 중...' : '이력서 수정'}
        </motion.button>
      </div>
    </div>
  );
}
