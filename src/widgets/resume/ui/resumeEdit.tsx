'use client';

import {
  CreateResumeRequest,
  useResumeMetadata,
  ResumeType,
  useResumeDetail,
  UpdateResumeRequest,
} from '@/entities';
import { useCreateResumeMutation, useUpdateResumeMutation } from '@/features';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SearchableDropdown, TechStackTags, useModalStore } from '@/shared';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ResumeTemplateModal } from './ResumeTemplateModal';

type ItemType = {
  name: string;
  required: boolean;
  state: boolean;
  meta: string;
};

export function ResumeDocumentEdit({ resumeId }: { resumeId: number }) {
  // 이력서 상세 정보 가져오기 (edit 모드일 때만)
  const {
    data: resumeDetailData,
    isError: detailError,
    isLoading: detailLoading,
  } = useResumeDetail(resumeId);

  // 메타 데이터 api (not used directly for items, kept for context)
  const {
    data: metaData,
    isError: metaError,
    isLoading: metaLoading,
  } = useResumeMetadata();

  const [DataForm, setDataForm] = useState<CreateResumeRequest>({
    title: '',
    type: 'DEFAULT', // 'DEFAULT' or 'MODERN'
    name: '',
    email: '',
    phone: '',
    birthYear: 2000,
    careerType: 'FRESHMAN',
    fieldName: '',
    introduction: '',
    githubUrl: '',
    blogUrl: '',
    notionUrl: '',
    techStacks: [],
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
    projects: [
      {
        name: '',
        startDate: '',
        endDate: '',
        deployUrl: '',
        repositoryUrl: '',
        description: '',
        detailedDescription: '',
        projectType: 'PERSONAL',
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

  // edit 모드일 때 기존 데이터로 form 초기화
  useEffect(() => {
    if (resumeDetailData) {
      setDataForm({
        title: resumeDetailData.title || '',
        type: resumeDetailData.type || 'DEFAULT',
        name: resumeDetailData.name || '',
        email: resumeDetailData.email || '',
        phone: resumeDetailData.phone || '',
        birthYear: resumeDetailData.birthYear || 2000,
        careerType: resumeDetailData.careerType || 'FRESHMAN',
        fieldName: resumeDetailData.fieldName || '',
        introduction: resumeDetailData.introduction || '',
        githubUrl: resumeDetailData.githubUrl || '',
        blogUrl: resumeDetailData.blogUrl || '',
        notionUrl: resumeDetailData.notionUrl || '',
        techStacks: resumeDetailData.techStacks || [],
        educations:
          resumeDetailData.educations && resumeDetailData.educations.length > 0
            ? resumeDetailData.educations
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
        projects:
          resumeDetailData.projects && resumeDetailData.projects.length > 0
            ? resumeDetailData.projects
            : [
                {
                  name: '',
                  startDate: '',
                  endDate: '',
                  deployUrl: '',
                  repositoryUrl: '',
                  description: '',
                  detailedDescription: '',
                  projectType: 'PERSONAL',
                  techStacks: [],
                },
              ],
        careers:
          resumeDetailData.careers && resumeDetailData.careers.length > 0
            ? resumeDetailData.careers
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
          resumeDetailData.trainings && resumeDetailData.trainings.length > 0
            ? resumeDetailData.trainings
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
          resumeDetailData.additionalInfos &&
          resumeDetailData.additionalInfos.length > 0
            ? resumeDetailData.additionalInfos
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
        customLinks: resumeDetailData.customLinks || [],
      });
    }
  }, [resumeDetailData]);

  // Initial item list (static mapping to DataForm fields)
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

  // 항목에 실제 내용이 있는지 확인하는 함수 (필수 속성들이 모두 있을 때만 true)
  const hasContent = (itemName: string): boolean => {
    const allHaveProps = (arr: any[], props: string[]) => {
      if (!Array.isArray(arr) || arr.length === 0) return false;
      return arr.every((it) =>
        props.every((p) => {
          const v = it?.[p];
          if (v === undefined || v === null) return false;
          if (typeof v === 'string') return v.trim() !== '';
          if (Array.isArray(v)) return v.length > 0;
          if (typeof v === 'object') return Object.keys(v).length > 0;
          return Boolean(v);
        }),
      );
    };

    switch (itemName) {
      case '프로필':
        // 기본 정보: 이름, 이메일, 전화
        return Boolean(
          DataForm.name &&
            DataForm.email &&
            DataForm.phone &&
            String(DataForm.name).trim() !== '' &&
            String(DataForm.email).trim() !== '' &&
            String(DataForm.phone).trim() !== '',
        );

      case '간단소개':
        return Boolean(
          DataForm.introduction && DataForm.introduction.trim() !== '',
        );

      case '학력':
        // 각 학력 항목에 schoolName, degreeLevel, graduationDate 있음
        return allHaveProps((DataForm.educations as any) || [], [
          'schoolName',
          'degreeLevel',
          'graduationDate',
        ]);

      case '경력':
        // 각 경력 항목에 companyName, startDate, endDate, mainTasks 있음
        return allHaveProps((DataForm.careers as any) || [], [
          'companyName',
          'startDate',
          'endDate',
          'mainTasks',
        ]);

      case '프로젝트':
        // 프로젝트: name, startDate, endDate
        return allHaveProps((DataForm.projects as any) || [], [
          'name',
          'startDate',
          'endDate',
        ]);

      case '기술스택':
        // 기술스택: 적어도 하나가 있고 각 항목에 techStackId
        return allHaveProps((DataForm.techStacks as any) || [], [
          'techStackId',
        ]);

      case '교육이력':
        // trainings: courseName, startDate, endDate
        return allHaveProps((DataForm.trainings as any) || [], [
          'courseName',
          'startDate',
          'endDate',
        ]);

      case '기타사항':
        // additionalInfos: activityName 존재 여부로 판단
        return allHaveProps((DataForm.additionalInfos as any) || [], [
          'activityName',
        ]);

      case '링크':
        // 외부 링크 중 하나라도 유효하거나 customLinks에 유효한 항목이 있는지
        const hasTopLinks = Boolean(
          (DataForm.githubUrl && String(DataForm.githubUrl).trim() !== '') ||
            (DataForm.blogUrl && String(DataForm.blogUrl).trim() !== '') ||
            (DataForm.notionUrl && String(DataForm.notionUrl).trim() !== ''),
        );
        const customLinksOk = allHaveProps(
          (DataForm.customLinks as any) || [],
          ['name', 'url'],
        );
        return hasTopLinks || customLinksOk;

      default:
        return false;
    }
  };

  const handleToggle = (index: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, state: !it.state } : it)),
    );
  };

  if (metaLoading) return <div>Loading...</div>;
  if (metaError || !metaData) return <div>No data</div>;

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* 좌측 - 항목 편집 */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">항목 편집</h2>

            {/* 항목 편집 컨테이너 (분리된 함수 호출) */}
            <LeftSection
              items={items}
              setItems={setItems}
              hasContent={hasContent}
            />

            {/* 선택된 항목 수 표시 */}
            <div className="mt-4 rounded-lg bg-gray-100 p-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  완료:&nbsp;
                  <span className="font-semibold">
                    {
                      items.filter(
                        (item) => hasContent(item.name) && item.state,
                      ).length
                    }
                  </span>
                  개
                </span>
                <span>
                  필수:&nbsp;
                  <span className="font-semibold">
                    {items.filter((item) => item.required).length}
                  </span>
                  개
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 - 이력서 입력 폼 */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">
              이력서 작성
            </h1>

            {/* 이력서 제목 */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이력서 제목
              </label>
              <input
                type="text"
                value={DataForm.title}
                onChange={(e) =>
                  setDataForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="이력서 제목을 입력하세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <RightSection
              items={items}
              DataForm={DataForm}
              setDataForm={setDataForm}
              hasContent={hasContent}
              resumeId={resumeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type LeftSectionProps = {
  items: ItemType[];
  setItems: Dispatch<SetStateAction<ItemType[]>>;
  hasContent: (name: string) => boolean;
};

function LeftSection({ items, setItems, hasContent }: LeftSectionProps) {
  const handleToggle = (index: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, state: !it.state } : it)),
    );
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const hasContentValue = hasContent(item.name);
        const isActive = item.state && hasContentValue;

        return (
          <motion.div
            onClick={() => handleToggle(index)}
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-2 transition-all duration-200 ${
              isActive
                ? 'border-blue-200 bg-blue-50/50'
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* 상태 표시 아이콘 */}
              <div
                className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
              />

              {/* 항목 이름 */}
              <span
                className={`text-xs font-medium ${isActive ? 'text-gray-800' : 'text-gray-500'}`}
              >
                {item.name}
              </span>

              {/* 필수 항목 표시 */}
              {item.required && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                  필수
                </span>
              )}
            </div>

            {/* 토글 버튼 (required가 false일 때만 표시) */}
            {!item.required && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`relative h-4 w-7 rounded-full transition-all duration-200 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none ${
                  item.state ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: item.state ? 12 : 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm"
                />
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

type RightSectionProps = {
  items: ItemType[];
  DataForm: CreateResumeRequest;
  setDataForm: Dispatch<SetStateAction<CreateResumeRequest>>;
  hasContent: (name: string) => boolean;
  resumeId: number;
};

function RightSection({
  items,
  DataForm,
  setDataForm,
  hasContent,
  resumeId,
}: RightSectionProps) {
  // 메타데이터 가져오기
  const {
    data: metaData,
    isError: metaError,
    isLoading: metaLoading,
  } = useResumeMetadata();
  const router = useRouter();
  const { open, close } = useModalStore();

  // 이력서 생성/수정 mutation
  const createMutation = useCreateResumeMutation({ page: 0, size: 10 });
  const updateMutation = useUpdateResumeMutation({
    params: { page: 0, size: 10 },
    resumeId: resumeId || 0,
  });

  // edit 모드인지 확인
  const isEditMode = !!resumeId;

  // 상태 관리
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [techStackSearch, setTechStackSearch] = useState('');
  const [graduationStatusOpen, setGraduationStatusOpen] = useState({
    educationIndex: -1,
  });

  // 경력 기술스택 드롭다운 상태 관리
  const [careerTechStackStates, setCareerTechStackStates] = useState<{
    [key: number]: { isOpen: boolean; search: string };
  }>({});

  // 프로젝트 기술스택 드롭다운 상태 관리
  const [projectTechStackStates, setProjectTechStackStates] = useState<{
    [key: number]: { isOpen: boolean; search: string };
  }>({});

  // 교육이력 기술스택 드롭다운 상태 관리
  const [trainingTechStackStates, setTrainingTechStackStates] = useState<{
    [key: number]: { isOpen: boolean; search: string };
  }>({});

  // 메타데이터에서 데이터 추출
  const techStacks = metaData?.techStacks || [];
  const degreeLevels = metaData?.degreeLevels || [];
  const proficiencyLevels = metaData?.proficiencyLevels || [];

  // 로딩 상태 처리
  if (metaLoading || isEditMode) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">
          {metaLoading && '메타데이터를 불러오는 중...'}
          {isEditMode && '이력서 정보를 불러오는 중...'}
        </div>
      </div>
    );
  }

  if (metaError || !metaData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">
          메타데이터를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  // 핸들러 함수들
  const handleTechStackToggle = () => setIsTechStackOpen(!isTechStackOpen);

  const handleTechStackSelect = (tech: any) => {
    // 중복 체크
    const isAlreadySelected = DataForm.techStacks?.some(
      (stack) => stack.techStackId === tech.id,
    );
    if (!isAlreadySelected) {
      setDataForm((prev) => ({
        ...prev,
        techStacks: [
          ...(prev.techStacks || []),
          {
            techStackId: tech.id,
            proficiencyLevel: 'BEGINNER',
          },
        ],
      }));
    }
    setIsTechStackOpen(false);
    setTechStackSearch('');
  };

  const handleRemoveTechStack = (index: number) => {
    setDataForm((prev) => ({
      ...prev,
      techStacks: prev.techStacks?.filter((_, i) => i !== index) || [],
    }));
  };

  const getFilteredTechStacks = () => {
    return techStacks.filter(
      (tech: any) =>
        tech.name.toLowerCase().includes(techStackSearch.toLowerCase()) &&
        !DataForm.techStacks?.some((stack) => stack.techStackId === tech.id),
    );
  };

  // 경력 기술스택 필터링 함수
  const getFilteredCareerTechStacks = (careerIndex: number, search: string) => {
    const career = DataForm.careers?.[careerIndex];
    return techStacks.filter(
      (tech: any) =>
        tech.name.toLowerCase().includes(search.toLowerCase()) &&
        !career?.techStacks?.some((stack) => stack.techStackId === tech.id),
    );
  };

  // 프로젝트 기술스택 필터링 함수
  const getFilteredProjectTechStacks = (
    projectIndex: number,
    search: string,
  ) => {
    const project = DataForm.projects?.[projectIndex];
    return techStacks.filter(
      (tech: any) =>
        tech.name.toLowerCase().includes(search.toLowerCase()) &&
        !project?.techStacks?.some((stack) => stack.techStackId === tech.id),
    );
  };

  // 교육이력 기술스택 필터링 함수
  const getFilteredTrainingTechStacks = (
    trainingIndex: number,
    search: string,
  ) => {
    const training = DataForm.trainings?.[trainingIndex];
    return techStacks.filter(
      (tech: any) =>
        tech.name.toLowerCase().includes(search.toLowerCase()) &&
        !training?.techStacks?.some((stack) => stack.techStackId === tech.id),
    );
  };

  // 경력 기술스택 드롭다운 토글
  const handleCareerTechStackToggle = (careerIndex: number) => {
    setCareerTechStackStates((prev) => ({
      ...prev,
      [careerIndex]: {
        isOpen: !prev[careerIndex]?.isOpen,
        search: prev[careerIndex]?.search || '',
      },
    }));
  };

  // 프로젝트 기술스택 드롭다운 토글
  const handleProjectTechStackToggle = (projectIndex: number) => {
    setProjectTechStackStates((prev) => ({
      ...prev,
      [projectIndex]: {
        isOpen: !prev[projectIndex]?.isOpen,
        search: prev[projectIndex]?.search || '',
      },
    }));
  };

  // 교육이력 기술스택 드롭다운 토글
  const handleTrainingTechStackToggle = (trainingIndex: number) => {
    setTrainingTechStackStates((prev) => ({
      ...prev,
      [trainingIndex]: {
        isOpen: !prev[trainingIndex]?.isOpen,
        search: prev[trainingIndex]?.search || '',
      },
    }));
  };

  // 경력 기술스택 검색 변경
  const handleCareerTechStackSearchChange = (
    careerIndex: number,
    search: string,
  ) => {
    setCareerTechStackStates((prev) => ({
      ...prev,
      [careerIndex]: {
        isOpen: prev[careerIndex]?.isOpen || false,
        search,
      },
    }));
  };

  // 프로젝트 기술스택 검색 변경
  const handleProjectTechStackSearchChange = (
    projectIndex: number,
    search: string,
  ) => {
    setProjectTechStackStates((prev) => ({
      ...prev,
      [projectIndex]: {
        isOpen: prev[projectIndex]?.isOpen || false,
        search,
      },
    }));
  };

  // 교육이력 기술스택 검색 변경
  const handleTrainingTechStackSearchChange = (
    trainingIndex: number,
    search: string,
  ) => {
    setTrainingTechStackStates((prev) => ({
      ...prev,
      [trainingIndex]: {
        isOpen: prev[trainingIndex]?.isOpen || false,
        search,
      },
    }));
  };

  // 경력 기술스택 선택
  const handleCareerTechStackSelect = (careerIndex: number, tech: any) => {
    handleAddCareerTechStack(careerIndex, tech);
    setCareerTechStackStates((prev) => ({
      ...prev,
      [careerIndex]: {
        isOpen: false,
        search: '',
      },
    }));
  };

  // 프로젝트 기술스택 선택
  const handleProjectTechStackSelect = (projectIndex: number, tech: any) => {
    handleAddProjectTechStack(projectIndex, tech);
    setProjectTechStackStates((prev) => ({
      ...prev,
      [projectIndex]: {
        isOpen: false,
        search: '',
      },
    }));
  };

  // 교육이력 기술스택 선택
  const handleTrainingTechStackSelect = (trainingIndex: number, tech: any) => {
    handleAddTrainingTechStack(trainingIndex, tech);
    setTrainingTechStackStates((prev) => ({
      ...prev,
      [trainingIndex]: {
        isOpen: false,
        search: '',
      },
    }));
  };

  const handleAddEducation = () => {
    setDataForm((prev) => ({
      ...prev,
      educations: [
        ...(prev.educations || []),
        {
          schoolName: '',
          degreeLevel: 'HIGH_SCHOOL',
          graduationDate: '',
          major: '',
          personalGpa: null,
          totalGpa: null,
        },
      ],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    if ((DataForm.educations?.length || 0) > 0) {
      setDataForm((prev) => ({
        ...prev,
        educations: prev.educations?.filter((_, i) => i !== index) || [],
      }));
    }
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      educations:
        prev.educations?.map((edu, i) =>
          i === index ? { ...edu, [field]: value } : edu,
        ) || [],
    }));
  };

  const toggleGraduationStatusDropdown = (index: number) => {
    setGraduationStatusOpen((prev) => ({
      educationIndex: prev.educationIndex === index ? -1 : index,
    }));
  };

  const handleGraduationStatusSelect = (index: number, status: string) => {
    handleEducationChange(index, 'degreeLevel', status);
    setGraduationStatusOpen({ educationIndex: -1 });
  };

  const handleAddCustomLink = () => {
    setDataForm((prev) => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { name: '', url: '' }],
    }));
  };

  const handleRemoveCustomLink = (index: number) => {
    setDataForm((prev) => ({
      ...prev,
      customLinks: prev.customLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleCustomLinkChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      customLinks:
        prev.customLinks?.map((link, i) =>
          i === index ? { ...link, [field]: value } : link,
        ) || [],
    }));
  };

  // 이력서 저장 핸들러 (템플릿 선택 후 저장)
  const handleSaveResumeWithTemplate = () => {
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
    // 필수 항목들은 무조건 포함, 선택 항목들은 state가 true이고 내용이 있을 때만 포함
    // 선택 항목에서 state가 true이지만 내용이 없으면 에러 알림
    const filteredDataForm: CreateResumeRequest = { ...DataForm };

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

    // 검증 완료 후 템플릿 선택 모달 열기
    const handleTemplateSelect = (type: ResumeType) => {
      const finalDataForm = { ...filteredDataForm, type };
      saveResumeWithCurrentTemplate(finalDataForm);
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

  // 템플릿 선택만 하는 함수 (저장 없음)
  const handleSelectTemplate = () => {
    showTemplateSelectionModal();
  };

  // 현재 선택된 템플릿으로 이력서 저장하는 함수
  const handleSaveResume = () => {
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
    const filteredDataForm: CreateResumeRequest = { ...DataForm };

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

    // 현재 FormData의 type을 사용해서 저장
    saveResumeWithCurrentTemplate(filteredDataForm);
  };

  // 템플릿 선택 모달 표시
  const showTemplateSelectionModal = () => {
    const handleTemplateSelect = (type: ResumeType) => {
      // FormData의 type만 변경
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

  // 현재 선택된 템플릿으로 이력서 저장
  const saveResumeWithCurrentTemplate = (formData: CreateResumeRequest) => {
    const mutation = isEditMode ? updateMutation : createMutation;

    mutation.mutate(formData, {
      onSuccess: () => {
        // 성공 토스트는 useCustomMutation의 successMessage에서 처리되므로 중복 방지
        router.push('/resume'); // 이력서 목록 페이지로 이동
      },
      onError: (error: any) => {
        console.error(`이력서 ${isEditMode ? '수정' : '저장'} 실패:`, error);
        // 에러 토스트는 useCustomMutation에서 처리되므로 중복 방지
      },
    });
  };

  // 경력 관련 핸들러
  const handleAddCareer = () => {
    setDataForm((prev) => ({
      ...prev,
      careers: [
        ...(prev.careers || []),
        {
          companyName: '',
          departmentPosition: '',
          startDate: '',
          endDate: '',
          companyDescription: '',
          mainTasks: '',
          techStacks: [],
        },
      ],
    }));
  };

  const handleRemoveCareer = (index: number) => {
    setDataForm((prev) => ({
      ...prev,
      careers: prev.careers?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleCareerChange = (index: number, field: string, value: string) => {
    setDataForm((prev) => ({
      ...prev,
      careers:
        prev.careers?.map((career, i) =>
          i === index ? { ...career, [field]: value } : career,
        ) || [],
    }));
  };

  // 경력 기술스택 관련 핸들러
  const handleAddCareerTechStack = (careerIndex: number, tech: any) => {
    setDataForm((prev) => ({
      ...prev,
      careers:
        prev.careers?.map((career, i) =>
          i === careerIndex
            ? {
                ...career,
                techStacks: [
                  ...(career.techStacks || []),
                  { techStackId: tech.id },
                ],
              }
            : career,
        ) || [],
    }));
  };

  const handleRemoveCareerTechStack = (
    careerIndex: number,
    techStackIndex: number,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      careers:
        prev.careers?.map((career, i) =>
          i === careerIndex
            ? {
                ...career,
                techStacks:
                  career.techStacks?.filter(
                    (_, idx) => idx !== techStackIndex,
                  ) || [],
              }
            : career,
        ) || [],
    }));
  };

  // 프로젝트 관련 핸들러
  const handleAddProject = () => {
    setDataForm((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          startDate: '',
          endDate: '',
          name: '',
          description: '',
          deployUrl: '',
          repositoryUrl: '',
          detailedDescription: '',
          projectType: 'PERSONAL',
          techStacks: [],
        },
      ],
    }));
  };

  const handleRemoveProject = (index: number) => {
    setDataForm((prev) => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setDataForm((prev) => ({
      ...prev,
      projects:
        prev.projects?.map((project, i) =>
          i === index ? { ...project, [field]: value } : project,
        ) || [],
    }));
  };

  // 프로젝트 기술스택 관련 핸들러
  const handleAddProjectTechStack = (projectIndex: number, tech: any) => {
    setDataForm((prev) => ({
      ...prev,
      projects:
        prev.projects?.map((project, i) =>
          i === projectIndex
            ? {
                ...project,
                techStacks: [
                  ...(project.techStacks || []),
                  { techStackId: tech.id },
                ],
              }
            : project,
        ) || [],
    }));
  };

  const handleRemoveProjectTechStack = (
    projectIndex: number,
    techStackIndex: number,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      projects:
        prev.projects?.map((project, i) =>
          i === projectIndex
            ? {
                ...project,
                techStacks:
                  project.techStacks?.filter(
                    (_, idx) => idx !== techStackIndex,
                  ) || [],
              }
            : project,
        ) || [],
    }));
  };

  // 교육이력 관련 핸들러
  const handleAddTraining = () => {
    setDataForm((prev) => ({
      ...prev,
      trainings: [
        ...(prev.trainings || []),
        {
          startDate: '',
          endDate: '',
          courseName: '',
          institutionName: '',
          detailedContent: '',
          techStacks: [],
        },
      ],
    }));
  };

  const handleRemoveTraining = (index: number) => {
    setDataForm((prev) => ({
      ...prev,
      trainings: prev.trainings?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleTrainingChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      trainings:
        prev.trainings?.map((training, i) =>
          i === index ? { ...training, [field]: value } : training,
        ) || [],
    }));
  };

  // 교육이력 기술스택 관련 핸들러
  const handleAddTrainingTechStack = (trainingIndex: number, tech: any) => {
    setDataForm((prev) => ({
      ...prev,
      trainings:
        prev.trainings?.map((training, i) =>
          i === trainingIndex
            ? {
                ...training,
                techStacks: [
                  ...(training.techStacks || []),
                  { techStackId: tech.id },
                ],
              }
            : training,
        ) || [],
    }));
  };

  const handleRemoveTrainingTechStack = (
    trainingIndex: number,
    techStackIndex: number,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      trainings:
        prev.trainings?.map((training, i) =>
          i === trainingIndex
            ? {
                ...training,
                techStacks:
                  training.techStacks?.filter(
                    (_, idx) => idx !== techStackIndex,
                  ) || [],
              }
            : training,
        ) || [],
    }));
  };

  // 기타사항 관련 핸들러
  const handleAddAdditionalInfo = () => {
    setDataForm((prev) => ({
      ...prev,
      additionalInfos: [
        ...(prev.additionalInfos || []),
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
    }));
  };

  const handleRemoveAdditionalInfo = (index: number) => {
    setDataForm((prev) => ({
      ...prev,
      additionalInfos:
        prev.additionalInfos?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAdditionalInfoChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setDataForm((prev) => ({
      ...prev,
      additionalInfos:
        prev.additionalInfos?.map((info, i) =>
          i === index ? { ...info, [field]: value } : info,
        ) || [],
    }));
  };

  return (
    <div>
      {/* 기본정보 섹션 */}
      {items.find((item) => item.name === '프로필')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">기본정보</h2>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                placeholder="이름을 입력해 주세요"
                type="text"
                value={DataForm.name}
                onChange={(e) =>
                  setDataForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                생년월일(연도)
              </label>
              <input
                type="number"
                value={DataForm.birthYear || ''}
                onChange={(e) =>
                  setDataForm((prev) => ({
                    ...prev,
                    birthYear: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="연도를 입력하세요(ex. 2000)"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                placeholder="이메일을 입력해 주세요"
                type="email"
                value={DataForm.email}
                onChange={(e) =>
                  setDataForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <input
                type="tel"
                value={DataForm.phone}
                onChange={(e) =>
                  setDataForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="010-1234-5678"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              경력 구분
            </label>
            <div className="flex gap-4">
              {(metaData?.careerTypes || []).map((careerType: any) => (
                <label key={careerType.value} className="flex items-center">
                  <input
                    type="radio"
                    name="careerType"
                    value={careerType.value}
                    checked={DataForm.careerType === careerType.value}
                    onChange={(e) =>
                      setDataForm((prev) => ({
                        ...prev,
                        careerType: e.target.value as any,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {careerType.description}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {items.find((item) => item.name === '간단소개')?.state && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                간단소개
              </label>
              <textarea
                value={DataForm.introduction}
                onChange={(e) =>
                  setDataForm((prev) => ({
                    ...prev,
                    introduction: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="간단한 자기소개를 3~5줄 정도로 작성해 주세요"
              />
            </div>
          )}
        </div>
      )}

      {/* 학력 섹션 */}
      {items.find((item) => item.name === '학력')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">학력</h2>
            <button
              type="button"
              onClick={handleAddEducation}
              className="rounded-lg border-2 border-dashed border-blue-300 px-4 py-2 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
            >
              + 학력 추가
            </button>
          </div>

          <div className="space-y-6">
            {(DataForm.educations || []).map((education, index) => (
              <div
                key={index}
                className={`relative rounded-lg border border-gray-200 p-4 ${
                  (DataForm.educations?.length || 0) > 0 ? 'pt-12' : ''
                }`}
              >
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="학력 삭제"
                  >
                    <i className="xi-close xi-x"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={education.schoolName}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          'schoolName',
                          e.target.value,
                        )
                      }
                      placeholder="학교명 (예: ABC 대학교)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={education.major || ''}
                      onChange={(e) =>
                        handleEducationChange(index, 'major', e.target.value)
                      }
                      placeholder="전공 (예: 컴퓨터공학과)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={education.graduationDate}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          'graduationDate',
                          e.target.value,
                        )
                      }
                      placeholder="졸업일 (예: 2022.02)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {/* 졸업 상태 선택 */}
                    <div className="relative">
                      <div
                        className="w-full cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        onClick={() => toggleGraduationStatusDropdown(index)}
                      >
                        {degreeLevels.find(
                          (degree: any) =>
                            degree.value === education.degreeLevel,
                        )?.description || '학위 수준을 선택하세요'}
                        <i className="xi-angle-down absolute top-1/2 right-3 -translate-y-1/2 transform"></i>
                      </div>
                      <AnimatePresence>
                        {graduationStatusOpen.educationIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg"
                          >
                            {degreeLevels.map((degree: any) => (
                              <div
                                key={degree.value}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={() =>
                                  handleGraduationStatusSelect(
                                    index,
                                    degree.value,
                                  )
                                }
                              >
                                {degree.description}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 링크 섹션 */}
      {items.find((item) => item.name === '링크')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">링크</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <i className="xi-github xi-3x"></i>
              <div className="flex-1">
                <label className="mb-1 block px-3 text-sm font-medium text-gray-700">
                  Github
                </label>
                <input
                  type="url"
                  value={DataForm.githubUrl}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/username"
                  className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="xi-blogger xi-3x"></i>
              <div className="flex-1">
                <label className="mb-1 block px-3 text-sm font-medium text-gray-700">
                  Blog
                </label>
                <input
                  type="url"
                  value={DataForm.blogUrl}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      blogUrl: e.target.value,
                    }))
                  }
                  placeholder="https://blog.example.com"
                  className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/icon/notion.svg"
                alt="Notion"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div className="flex-1">
                <label className="mb-1 block px-3 text-sm font-medium text-gray-700">
                  Notion
                </label>
                <input
                  type="url"
                  value={DataForm.notionUrl}
                  onChange={(e) =>
                    setDataForm((prev) => ({
                      ...prev,
                      notionUrl: e.target.value,
                    }))
                  }
                  placeholder="https://notion.so/username"
                  className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            {/* 커스텀 링크들 */}
            {(DataForm.customLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <i className="xi-link xi-3x text-gray-600"></i>
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) =>
                      handleCustomLinkChange(index, 'name', e.target.value)
                    }
                    placeholder="링크 제목 (예: 포트폴리오, 프로젝트 등)"
                    className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      handleCustomLinkChange(index, 'url', e.target.value)
                    }
                    placeholder="https://example.com"
                    className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  />
                </div>
                <i
                  className="xi-trash-o xi-x cursor-pointer"
                  onClick={() => handleRemoveCustomLink(index)}
                ></i>
              </div>
            ))}

            {/* 커스텀 링크 추가 버튼 */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddCustomLink}
                className="w-full rounded-lg border-2 border-dashed border-blue-300 px-4 py-3 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
              >
                + 커스텀 링크 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 개발직무 섹션 */}
      <div className="mb-8 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">개발직무</h2>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            직무 분야
          </label>
          <input
            type="text"
            value={DataForm.fieldName}
            onChange={(e) =>
              setDataForm((prev) => ({ ...prev, fieldName: e.target.value }))
            }
            placeholder="직무를 입력해주세요 (예: 프론트엔드 개발자)"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 기술스택 섹션 */}
      {items.find((item) => item.name === '기술스택')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">기술스택</h2>

          <SearchableDropdown
            label="기술스택 선택"
            placeholder="기술스택을 검색하여 선택하세요"
            searchPlaceholder="기술스택 검색..."
            options={getFilteredTechStacks().map((tech: any) => ({
              id: tech.id,
              name: tech.name,
            }))}
            onSelect={handleTechStackSelect}
            searchValue={techStackSearch}
            onSearchChange={setTechStackSearch}
            isOpen={isTechStackOpen}
            onToggle={handleTechStackToggle}
            className="mb-6"
          />

          {/* 선택된 기술스택 표시 */}
          {(DataForm.techStacks?.length || 0) > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                선택된 기술스택 ({DataForm.techStacks?.length || 0}개)
              </h3>
              <TechStackTags
                techStacks={DataForm.techStacks || []}
                allTechStacks={techStacks}
                onRemove={handleRemoveTechStack}
                colorScheme="blue"
              />
            </div>
          )}
        </div>
      )}

      {/* 경력 섹션 */}
      {items.find((item) => item.name === '경력')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">경력</h2>
            <button
              type="button"
              onClick={handleAddCareer}
              className="rounded-lg border-2 border-dashed border-blue-300 px-4 py-2 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
            >
              + 경력 추가
            </button>
          </div>

          <div className="space-y-6">
            {(DataForm.careers || []).map((career, index) => (
              <div
                key={index}
                className={`relative rounded-lg border border-gray-200 p-4 ${
                  (DataForm.careers?.length || 0) > 0 ? 'pt-12' : ''
                }`}
              >
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveCareer(index)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="경력 삭제"
                  >
                    <i className="xi-close xi-x"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={career.companyName || ''}
                      onChange={(e) =>
                        handleCareerChange(index, 'companyName', e.target.value)
                      }
                      placeholder="회사명"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={career.departmentPosition || ''}
                      onChange={(e) =>
                        handleCareerChange(
                          index,
                          'departmentPosition',
                          e.target.value,
                        )
                      }
                      placeholder="부서/직책"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={career.startDate || ''}
                      onChange={(e) =>
                        handleCareerChange(index, 'startDate', e.target.value)
                      }
                      placeholder="시작일 (예: 2023.03)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={career.endDate || ''}
                      onChange={(e) =>
                        handleCareerChange(index, 'endDate', e.target.value)
                      }
                      placeholder="종료일 (예: 2024.02 또는 현재)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    value={career.mainTasks || ''}
                    onChange={(e) =>
                      handleCareerChange(index, 'mainTasks', e.target.value)
                    }
                    placeholder="주요 업무 및 성과를 입력하세요"
                    rows={4}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <textarea
                    value={career.companyDescription || ''}
                    onChange={(e) =>
                      handleCareerChange(
                        index,
                        'companyDescription',
                        e.target.value,
                      )
                    }
                    placeholder="회사 설명 (선택사항)"
                    rows={2}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />

                  {/* 경력 기술스택 선택 */}
                  <div>
                    <SearchableDropdown
                      label="사용 기술스택"
                      placeholder="기술스택을 검색하여 선택하세요"
                      searchPlaceholder="기술스택 검색..."
                      options={getFilteredCareerTechStacks(
                        index,
                        careerTechStackStates[index]?.search || '',
                      ).map((tech: any) => ({
                        id: tech.id,
                        name: tech.name,
                      }))}
                      onSelect={(tech) =>
                        handleCareerTechStackSelect(index, tech)
                      }
                      searchValue={careerTechStackStates[index]?.search || ''}
                      onSearchChange={(search) =>
                        handleCareerTechStackSearchChange(index, search)
                      }
                      isOpen={careerTechStackStates[index]?.isOpen || false}
                      onToggle={() => handleCareerTechStackToggle(index)}
                    />

                    {/* 선택된 기술스택 표시 */}
                    <TechStackTags
                      techStacks={career.techStacks || []}
                      allTechStacks={techStacks}
                      onRemove={(techIndex) =>
                        handleRemoveCareerTechStack(index, techIndex)
                      }
                      colorScheme="green"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 섹션 */}
      {items.find((item) => item.name === '프로젝트')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">프로젝트</h2>
            <button
              type="button"
              onClick={handleAddProject}
              className="rounded-lg border-2 border-dashed border-blue-300 px-4 py-2 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
            >
              + 프로젝트 추가
            </button>
          </div>

          <div className="space-y-6">
            {(DataForm.projects || []).map((project, index) => (
              <div
                key={index}
                className={`relative rounded-lg border border-gray-200 p-4 ${
                  (DataForm.projects?.length || 0) > 0 ? 'pt-12' : ''
                }`}
              >
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(index)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="프로젝트 삭제"
                  >
                    <i className="xi-close xi-x"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={project.name || ''}
                    onChange={(e) =>
                      handleProjectChange(index, 'name', e.target.value)
                    }
                    placeholder="프로젝트 제목"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={project.startDate || ''}
                      onChange={(e) =>
                        handleProjectChange(index, 'startDate', e.target.value)
                      }
                      placeholder="시작일 (예: 2023.03)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={project.endDate || ''}
                      onChange={(e) =>
                        handleProjectChange(index, 'endDate', e.target.value)
                      }
                      placeholder="종료일 (예: 2024.02 또는 진행중)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="url"
                      value={project.deployUrl || ''}
                      onChange={(e) =>
                        handleProjectChange(index, 'deployUrl', e.target.value)
                      }
                      placeholder="배포 URL (선택사항)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="url"
                      value={project.repositoryUrl || ''}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          'repositoryUrl',
                          e.target.value,
                        )
                      }
                      placeholder="저장소 URL (선택사항)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) =>
                      handleProjectChange(index, 'description', e.target.value)
                    }
                    placeholder="프로젝트 설명"
                    rows={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <textarea
                    value={project.detailedDescription || ''}
                    onChange={(e) =>
                      handleProjectChange(
                        index,
                        'detailedDescription',
                        e.target.value,
                      )
                    }
                    placeholder="상세 설명 (선택사항)"
                    rows={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />

                  {/* 프로젝트 유형 선택 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      프로젝트 유형
                    </label>
                    <div className="flex gap-4">
                      {(metaData?.projectTypes || []).map(
                        (projectType: any) => (
                          <label
                            key={projectType.value}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              name={`projectType_${index}`}
                              value={projectType.value}
                              checked={
                                project.projectType === projectType.value
                              }
                              onChange={(e) =>
                                handleProjectChange(
                                  index,
                                  'projectType',
                                  e.target.value,
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {projectType.description}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  {/* 프로젝트 기술스택 선택 */}
                  <div>
                    <SearchableDropdown
                      label="사용 기술스택"
                      placeholder="기술스택을 검색하여 선택하세요"
                      searchPlaceholder="기술스택 검색..."
                      options={getFilteredProjectTechStacks(
                        index,
                        projectTechStackStates[index]?.search || '',
                      ).map((tech: any) => ({
                        id: tech.id,
                        name: tech.name,
                      }))}
                      onSelect={(tech) =>
                        handleProjectTechStackSelect(index, tech)
                      }
                      searchValue={projectTechStackStates[index]?.search || ''}
                      onSearchChange={(search) =>
                        handleProjectTechStackSearchChange(index, search)
                      }
                      isOpen={projectTechStackStates[index]?.isOpen || false}
                      onToggle={() => handleProjectTechStackToggle(index)}
                    />

                    {/* 선택된 기술스택 표시 */}
                    <TechStackTags
                      techStacks={project.techStacks || []}
                      allTechStacks={techStacks}
                      onRemove={(techIndex) =>
                        handleRemoveProjectTechStack(index, techIndex)
                      }
                      colorScheme="purple"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 교육이력 섹션 */}
      {items.find((item) => item.name === '교육이력')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">교육이력</h2>
            <button
              type="button"
              onClick={handleAddTraining}
              className="rounded-lg border-2 border-dashed border-blue-300 px-4 py-2 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
            >
              + 교육 추가
            </button>
          </div>

          <div className="space-y-6">
            {(DataForm.trainings || []).map((training, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 p-4 pt-12"
              >
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveTraining(index)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="교육이력 삭제"
                  >
                    <i className="xi-close xi-x"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={training.courseName || ''}
                    onChange={(e) =>
                      handleTrainingChange(index, 'courseName', e.target.value)
                    }
                    placeholder="과정명"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={training.institutionName || ''}
                    onChange={(e) =>
                      handleTrainingChange(
                        index,
                        'institutionName',
                        e.target.value,
                      )
                    }
                    placeholder="교육 기관명"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={training.startDate || ''}
                      onChange={(e) =>
                        handleTrainingChange(index, 'startDate', e.target.value)
                      }
                      placeholder="시작일 (예: 2023-03-01)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={training.endDate || ''}
                      onChange={(e) =>
                        handleTrainingChange(index, 'endDate', e.target.value)
                      }
                      placeholder="종료일 (예: 2023-06-30)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    value={training.detailedContent || ''}
                    onChange={(e) =>
                      handleTrainingChange(
                        index,
                        'detailedContent',
                        e.target.value,
                      )
                    }
                    placeholder="상세 내용 (선택사항)"
                    rows={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />

                  {/* 교육이력 기술스택 선택 */}
                  <div>
                    <SearchableDropdown
                      label="관련 기술스택"
                      placeholder="기술스택을 검색하여 선택하세요"
                      searchPlaceholder="기술스택 검색..."
                      options={getFilteredTrainingTechStacks(
                        index,
                        trainingTechStackStates[index]?.search || '',
                      ).map((tech: any) => ({
                        id: tech.id,
                        name: tech.name,
                      }))}
                      onSelect={(tech) =>
                        handleTrainingTechStackSelect(index, tech)
                      }
                      searchValue={trainingTechStackStates[index]?.search || ''}
                      onSearchChange={(search) =>
                        handleTrainingTechStackSearchChange(index, search)
                      }
                      isOpen={trainingTechStackStates[index]?.isOpen || false}
                      onToggle={() => handleTrainingTechStackToggle(index)}
                    />

                    {/* 선택된 기술스택 표시 */}
                    <TechStackTags
                      techStacks={training.techStacks || []}
                      allTechStacks={techStacks}
                      onRemove={(techIndex) =>
                        handleRemoveTrainingTechStack(index, techIndex)
                      }
                      colorScheme="orange"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 기타사항 섹션 */}
      {items.find((item) => item.name === '기타사항')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">기타사항</h2>
            <button
              type="button"
              onClick={handleAddAdditionalInfo}
              className="rounded-lg border-2 border-dashed border-blue-300 px-4 py-2 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
            >
              + 활동 추가
            </button>
          </div>

          <div className="space-y-6">
            {(DataForm.additionalInfos || []).map((info, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 p-4 pt-12"
              >
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalInfo(index)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="기타사항 삭제"
                  >
                    <i className="xi-close xi-x"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={info.activityName || ''}
                    onChange={(e) =>
                      handleAdditionalInfoChange(
                        index,
                        'activityName',
                        e.target.value,
                      )
                    }
                    placeholder="활동명/수상명/자격명"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={info.relatedOrganization || ''}
                    onChange={(e) =>
                      handleAdditionalInfoChange(
                        index,
                        'relatedOrganization',
                        e.target.value,
                      )
                    }
                    placeholder="관련 기관/수여처"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />

                  {/* 카테고리 선택 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      활동 유형
                    </label>
                    <div className="flex gap-4">
                      {(metaData?.additionalInfoCategories || []).map(
                        (category: any) => (
                          <label
                            key={category.value}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              name={`category_${index}`}
                              value={category.value}
                              checked={info.category === category.value}
                              onChange={(e) =>
                                handleAdditionalInfoChange(
                                  index,
                                  'category',
                                  e.target.value,
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {category.description}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={info.startDate || ''}
                      onChange={(e) =>
                        handleAdditionalInfoChange(
                          index,
                          'startDate',
                          e.target.value,
                        )
                      }
                      placeholder="시작일 (예: 2023-03-01)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={info.endDate || ''}
                      onChange={(e) =>
                        handleAdditionalInfoChange(
                          index,
                          'endDate',
                          e.target.value,
                        )
                      }
                      placeholder="종료일 (선택사항)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 자격증 번호 (자격증인 경우만) */}
                  {info.category === 'CERTIFICATE' && (
                    <input
                      type="text"
                      value={info.certificateNumber || ''}
                      onChange={(e) =>
                        handleAdditionalInfoChange(
                          index,
                          'certificateNumber',
                          e.target.value,
                        )
                      }
                      placeholder="자격증 번호"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  )}

                  {/* 어학 수준 (어학인 경우만) */}
                  {info.category === 'LANGUAGE' && (
                    <input
                      type="text"
                      value={info.languageLevel || ''}
                      onChange={(e) =>
                        handleAdditionalInfoChange(
                          index,
                          'languageLevel',
                          e.target.value,
                        )
                      }
                      placeholder="어학 수준 (예: TOEIC 850점, 회화 가능)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  )}

                  <textarea
                    value={info.detailedContent || ''}
                    onChange={(e) =>
                      handleAdditionalInfoChange(
                        index,
                        'detailedContent',
                        e.target.value,
                      )
                    }
                    placeholder="상세 내용 (선택사항)"
                    rows={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*현재 템플릿 타입 표시 */}
      {DataForm.type && (
        <div className="mb-4 rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-600">
          현재 선택된 템플릿 :&nbsp;
          <span className="font-medium">
            {DataForm.type === 'DEFAULT' ? '클래식' : '모던'}
          </span>
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="mt-12 flex justify-center gap-4">
        {/* 템플릿 선택 버튼 */}
        <motion.button
          onClick={handleSelectTemplate}
          disabled={createMutation.isPending || updateMutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="transform rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          템플릿 선택
        </motion.button>

        {/* 이력서 저장 버튼 */}
        <motion.button
          onClick={handleSaveResume}
          disabled={createMutation.isPending || updateMutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="transform rounded-xl border-2 border-blue-600 bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createMutation.isPending || updateMutation.isPending
            ? '저장 중...'
            : isEditMode
              ? '이력서 수정'
              : '이력서 저장'}
        </motion.button>
      </div>
    </div>
  );
}
