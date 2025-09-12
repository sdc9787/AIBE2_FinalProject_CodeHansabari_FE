'use client';

import { CreateResumeRequest, useResumeMetadata } from '@/entities';
import { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SectionMenuType {
  introduction: boolean;
  link: boolean;
  education: boolean;
  techStacks: boolean;
  customLinks: boolean;
  careers: boolean;
  projects: boolean;
  trainings: boolean;
  additionalInfos: boolean;
}

type ItemType = {
  name: string;
  required: boolean;
  state: boolean;
  meta: string;
};

const FieldNameList = [
  '프론트엔드 개발자',
  '백엔드 개발자',
  '풀스택 개발자',
  '모바일 앱 개발자',
  '게임 개발자',
  '데이터 사이언티스트',
  '데이터 엔지니어',
  '머신러닝 엔지니어',
  'AI 엔지니어',
  'DevOps 엔지니어',
  '시스템 엔지니어',
  '네트워크 엔지니어',
  '보안 엔지니어',
  '클라우드 엔지니어',
  'QA 엔지니어',
  'UI/UX 디자이너',
  '프로덕트 매니저',
  '프로젝트 매니저',
  'IT 컨설턴트',
  '기술 영업',
  '기타',
];

export function ResumeDocument() {
  // 메타 데이터 api (not used directly for items, kept for context)
  const {
    data: metaData,
    isError: metaError,
    isLoading: metaLoading,
  } = useResumeMetadata();
  const [DataForm, setDataForm] = useState<CreateResumeRequest>({
    title: '',
    type: 'DEFAULT',
    name: '',
    email: '',
    phone: '',
    birthYear: 0,
    careerType: 'FRESHMAN',
    introduction: '',
    fieldName: '',
    githubUrl: '',
    blogUrl: '',
    notionUrl: '',
    techStacks: [
      {
        techStackId: 0, // 기술 스택 ID
        proficiencyLevel: 'BEGINNER', //숙련도 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      },
    ],
    educations: [
      {
        schoolName: '', // 학교명
        degreeLevel: 'HIGH_SCHOOL', //학위 'HIGH_SCHOOL' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE';
        graduationDate: '', // 졸업일
        major: '', // 전공(선택)
        personalGpa: null, // 개인 학점(선택)
        totalGpa: null, // 총 학점(선택)
      },
    ],
    projects: [
      {
        startDate: '', // 프로젝트 시작일
        endDate: '', // 프로젝트 종료일
        name: '', // 프로젝트명
        description: '', // 프로젝트 설명(선택)
        deployUrl: '', // 배포 URL(선택)
        repositoryUrl: '', // 저장소 URL(선택)
        detailedDescription: '', // 상세 설명(선택)
        projectType: 'PERSONAL', // 프로젝트 유형 'PERSONAL' | 'TEAM';
        techStacks: [
          {
            techStackId: 0, // 기술 스택 ID
          },
        ], // 사용 기술 스택
      },
    ],
    careers: [
      {
        companyName: '', // 회사명
        departmentPosition: '', // 부서 및 직위
        startDate: '', // 재직 시작일
        endDate: '', // 재직 종료일
        companyDescription: '', // 회사 설명(선택)
        mainTasks: '', // 주요 업무 및 성과(선택)
        techStacks: [
          {
            techStackId: 0, // 기술 스택 ID
          },
        ], // 사용 기술 스택
      },
    ],
    trainings: [
      {
        courseName: '', // 과정명
        startDate: '', // 교육 시작일
        endDate: '', // 교육 종료일
        institutionName: '', // 교육 기관명(선택)
        detailedContent: '', // 상세 내용(선택)
        techStacks: [
          {
            techStackId: 0, // 기술 스택 ID
          },
        ],
      },
    ],
    additionalInfos: [
      {
        activityName: '', // 활동명
        category: 'AWARD', //활동 유형 'AWARD' | 'CERTIFICATION' | 'LANGUAGE' | 'ETC';
        relatedOrganization: '', // 관련 기관(선택)
        startDate: '', // 활동 시작일(선택)
        endDate: '', // 활동 종료일(선택)
        certificateNumber: '', // 자격증 번호(선택)
        detailedContent: '', // 상세 내용(선택)
        languageLevel: '', // 어학 수준(선택)
      },
    ],
    customLinks: [
      {
        name: '', // 링크 이름(예: 포트폴리오, 블로그)
        url: '', // 링크 URL
      },
    ],
  });

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
};

function RightSection({ items, DataForm, setDataForm }: RightSectionProps) {
  // 상태 관리
  const [isJobFieldOpen, setIsJobFieldOpen] = useState(false);
  const [jobFieldSearch, setJobFieldSearch] = useState('');
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [techStackSearch, setTechStackSearch] = useState('');
  const [graduationStatusOpen, setGraduationStatusOpen] = useState({
    educationIndex: -1,
  });

  // 상수 정의
  const TECH_STACKS = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue.js',
    'Angular',
    'Node.js',
    'Express',
    'Python',
    'Django',
    'Flask',
    'Java',
    'Spring',
    'Spring Boot',
    'C++',
    'C#',
    'PHP',
    'Laravel',
    'Ruby',
    'Rails',
    'Go',
    'Rust',
    'Swift',
    'Kotlin',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'Git',
    'GitHub',
    'GitLab',
    'Jenkins',
    'CI/CD',
  ];

  // 핸들러 함수들
  const handleJobFieldToggle = () => setIsJobFieldOpen(!isJobFieldOpen);
  const handleTechStackToggle = () => setIsTechStackOpen(!isTechStackOpen);

  const handleJobFieldSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setJobFieldSearch(e.target.value);
  };

  const handleTechStackSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTechStackSearch(e.target.value);
  };

  const handleJobFieldSelect = (job: string) => {
    setDataForm((prev) => ({ ...prev, fieldName: job }));
    setIsJobFieldOpen(false);
    setJobFieldSearch('');
  };

  const handleTechStackSelect = (tech: string) => {
    // 중복 체크
    const isAlreadySelected = DataForm.techStacks?.some(
      (stack) => stack.techStackId === TECH_STACKS.indexOf(tech),
    );
    if (!isAlreadySelected) {
      setDataForm((prev) => ({
        ...prev,
        techStacks: [
          ...(prev.techStacks || []),
          {
            techStackId: TECH_STACKS.indexOf(tech),
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

  const filteredJobFields = FieldNameList.filter((job) =>
    job.toLowerCase().includes(jobFieldSearch.toLowerCase()),
  );

  const getFilteredTechStacks = () => {
    return TECH_STACKS.filter(
      (tech) =>
        tech.toLowerCase().includes(techStackSearch.toLowerCase()) &&
        !DataForm.techStacks?.some(
          (stack) => stack.techStackId === TECH_STACKS.indexOf(tech),
        ),
    );
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
    if ((DataForm.educations?.length || 0) > 1) {
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
                  (DataForm.educations?.length || 0) > 1 ? 'pt-12' : ''
                }`}
              >
                {(DataForm.educations?.length || 0) > 1 && (
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
                )}

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
                        {education.degreeLevel || '학위 수준을 선택하세요'}
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
                            {[
                              'HIGH_SCHOOL',
                              'ASSOCIATE',
                              'BACHELOR',
                              'MASTER',
                              'DOCTORATE',
                            ].map((status) => (
                              <div
                                key={status}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={() =>
                                  handleGraduationStatusSelect(index, status)
                                }
                              >
                                {status}
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

        <div className="relative" data-select="job-field">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            직무 분야
          </label>
          <div className="relative">
            <motion.button
              type="button"
              onClick={handleJobFieldToggle}
              className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-left text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span
                className={
                  DataForm.fieldName ? 'text-gray-900' : 'text-gray-500'
                }
              >
                {DataForm.fieldName || '직무를 선택해주세요'}
              </span>
              <motion.span
                className="absolute right-3 text-gray-400"
                animate={{ rotate: isJobFieldOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {isJobFieldOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.15,
                    ease: 'easeOut',
                  }}
                  className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="직무 검색..."
                      value={jobFieldSearch}
                      onChange={handleJobFieldSearchChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                  <div className="max-h-60 overflow-x-hidden overflow-y-auto">
                    {filteredJobFields.map((job, index) => (
                      <button
                        key={job}
                        type="button"
                        onClick={() => handleJobFieldSelect(job)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-150 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {job}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 기술스택 섹션 */}
      {items.find((item) => item.name === '기술스택')?.state && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">기술스택</h2>

          <div className="mb-6 space-y-4">
            <div className="relative" data-select="tech-stack">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                기술스택 선택
              </label>
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={handleTechStackToggle}
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-left text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-gray-500">
                    기술스택을 검색하여 선택하세요
                  </span>
                  <motion.span
                    className="absolute right-3 text-gray-400"
                    animate={{ rotate: isTechStackOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {isTechStackOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{
                        duration: 0.15,
                        ease: 'easeOut',
                      }}
                      className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl"
                    >
                      <div className="border-b border-gray-100 p-3">
                        <input
                          type="text"
                          placeholder="기술스택 검색..."
                          value={techStackSearch}
                          onChange={handleTechStackSearchChange}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        />
                      </div>
                      <div className="max-h-60 overflow-x-hidden overflow-y-auto">
                        {getFilteredTechStacks().map((tech, index) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => handleTechStackSelect(tech)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-150 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700"
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 선택된 기술스택 표시 */}
          {(DataForm.techStacks?.length || 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                선택된 기술스택 ({DataForm.techStacks?.length || 0}개)
              </h3>
              <div className="flex flex-wrap gap-2">
                {(DataForm.techStacks || []).map((techStack, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {TECH_STACKS[techStack.techStackId] ||
                      `Tech ${techStack.techStackId}`}
                    <motion.button
                      type="button"
                      onClick={() => handleRemoveTechStack(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </motion.button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
