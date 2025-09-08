'use client';
import { Button } from '@/shared';
import { ResumeSection } from '@/entities/resume';

interface ResumeSidebarProps {
  sections: ResumeSection[];
  onSectionsChange: (sections: ResumeSection[]) => void;
  onSave: () => void;
  onAISuggest: () => void;
  isLoading?: boolean;
}

export function ResumeSidebar({
  sections,
  onSectionsChange,
  onSave,
  onAISuggest,
  isLoading = false,
}: ResumeSidebarProps) {
  // 섹션 토글
  const toggleSection = (sectionType: string) => {
    const existingSection = sections.find((s) => s.sectionType === sectionType);

    if (existingSection) {
      // 섹션이 있으면 제거
      onSectionsChange(sections.filter((s) => s.sectionType !== sectionType));
    } else {
      // 섹션이 없으면 추가 (기본 항목 1개 포함)
      const newSection: ResumeSection = {
        sectionType: sectionType,
        sectionTitle: getSectionTitle(sectionType),
        items: [getDefaultItem(sectionType)],
      };
      onSectionsChange([...sections, newSection]);
    }
  };

  // 섹션별 항목 추가
  const addSectionItem = (sectionType: string) => {
    const updatedSections = sections.map((section) => {
      if (section.sectionType === sectionType) {
        const newItem = getDefaultItem(sectionType);
        return {
          ...section,
          items: [...section.items, newItem],
        };
      }
      return section;
    });
    onSectionsChange(updatedSections);
  };

  const getSectionTitle = (type: string) => {
    const titles: Record<string, string> = {
      experience: '경력',
      education: '학력',
      skills: '링크',
      projects: '프로젝트',
      certificates: '자기소개서',
      personality: '성격',
      development: '개발직군',
      activities: '기타사항',
    };
    return titles[type] || type;
  };

  const getDefaultItem = (sectionType: string) => {
    return {
      title: '새 항목',
      subTitle: '',
      startDate: '',
      endDate: '',
      description: '',
    };
  };

  const sectionConfigs = [
    { type: 'basic', title: '기본정보', required: true },
    { type: 'photo', title: '사진', required: false },
    { type: 'introduction', title: '간단소개', required: false },
    { type: 'development', title: '개발직군', required: false },
    { type: 'skills', title: '기술스택', required: false },
    { type: 'skills', title: '링크', required: false },
    { type: 'experience', title: '학력', required: false },
    { type: 'projects', title: '경력', required: false },
    { type: 'projects', title: '프로젝트', required: false },
    { type: 'education', title: '교육이력', required: false },
    { type: 'activities', title: '기타사항', required: false },
    { type: 'certificates', title: '자기소개서', required: false },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white">
      <div className="p-4">
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="mb-1 text-lg font-bold text-gray-800">항목편집</h2>
          <div className="flex text-xs text-gray-500">
            <span className="mr-4">필수 항목</span>
            <span>선택 항목</span>
          </div>
        </div>

        {/* 섹션 토글들 */}
        <div className="space-y-3">
          {sectionConfigs.map((config, index) => {
            const isActive = sections.some(
              (s) => s.sectionType === config.type,
            );
            const section = sections.find((s) => s.sectionType === config.type);

            return (
              <div
                key={`${config.type}-${index}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span
                    className={`text-sm ${config.required ? 'font-medium text-gray-800' : 'text-gray-600'}`}
                  >
                    {config.title}
                  </span>
                  {config.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </div>

                {!config.required && (
                  <button
                    onClick={() => toggleSection(config.type)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                      isActive ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}

                {config.required && (
                  <div className="relative h-6 w-11 rounded-full bg-green-500">
                    <span className="inline-block h-4 w-4 translate-x-6 translate-y-1 transform rounded-full bg-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 항목 추가 버튼들 */}
        <div className="mt-8 space-y-2">
          {sections.map((section) => (
            <div
              key={section.sectionType}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-600">
                {section.sectionTitle}
              </span>
              <button
                onClick={() => addSectionItem(section.sectionType)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + 항목 추가
              </button>
            </div>
          ))}
        </div>

        {/* 하단 버튼들 */}
        <div className="absolute right-4 bottom-6 left-4 space-y-3">
          <Button
            onClick={onAISuggest}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-2 text-sm text-white hover:from-purple-600 hover:to-blue-600"
          >
            AI 첨삭받기
          </Button>

          <Button
            onClick={onSave}
            disabled={isLoading}
            loading={isLoading}
            className="w-full bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
