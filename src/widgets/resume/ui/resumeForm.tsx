'use client';
import { Button, Input, Textarea } from '@/shared';
import { MemberInfo, ResumeSection, ResumeItem } from '@/entities/resume';

interface ResumeFormProps {
  memberInfo: MemberInfo;
  sections: ResumeSection[];
  onMemberInfoChange: (memberInfo: MemberInfo) => void;
  onSectionsChange: (sections: ResumeSection[]) => void;
}

export function ResumeForm({
  memberInfo,
  sections,
  onMemberInfoChange,
  onSectionsChange,
}: ResumeFormProps) {
  const handleMemberInfoChange = (field: keyof MemberInfo, value: string) => {
    onMemberInfoChange({
      ...memberInfo,
      [field]: value,
    });
  };

  const addSection = () => {
    const newSection: ResumeSection = {
      sectionType: 'CUSTOM',
      sectionTitle: '',
      items: [],
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSection = (
    sectionIndex: number,
    field: keyof ResumeSection,
    value: string | ResumeItem[],
  ) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex ? { ...section, [field]: value } : section,
    );
    onSectionsChange(updatedSections);
  };

  const removeSection = (sectionIndex: number) => {
    const updatedSections = sections.filter(
      (_, index) => index !== sectionIndex,
    );
    onSectionsChange(updatedSections);
  };

  const addItem = (sectionIndex: number) => {
    const newItem: ResumeItem = {
      title: '',
      subTitle: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex
        ? { ...section, items: [...section.items, newItem] }
        : section,
    );
    onSectionsChange(updatedSections);
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    field: keyof ResumeItem,
    value: string,
  ) => {
    const updatedSections = sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            items: section.items.map((item, iIndex) =>
              iIndex === itemIndex ? { ...item, [field]: value } : item,
            ),
          }
        : section,
    );
    onSectionsChange(updatedSections);
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            items: section.items.filter((_, iIndex) => iIndex !== itemIndex),
          }
        : section,
    );
    onSectionsChange(updatedSections);
  };

  return (
    <div className="space-y-8">
      {/* 개인정보 섹션 */}
      <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">개인정보</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="name"
              label="이름"
              value={memberInfo.name || ''}
              onChange={(e) => handleMemberInfoChange('name', e.target.value)}
              placeholder="홍길동"
              className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <Input
              id="email"
              label="이메일"
              type="email"
              value={memberInfo.email || ''}
              onChange={(e) => handleMemberInfoChange('email', e.target.value)}
              placeholder="hong@example.com"
              className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="phoneNumber"
              label="연락처"
              value={memberInfo.phoneNumber || ''}
              onChange={(e) =>
                handleMemberInfoChange('phoneNumber', e.target.value)
              }
              placeholder="010-1234-5678"
              className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <Input
              id="blogUrl"
              label="블로그/포트폴리오 URL (선택)"
              value={memberInfo.blogUrl || ''}
              onChange={(e) =>
                handleMemberInfoChange('blogUrl', e.target.value)
              }
              placeholder="https://myportfolio.com"
              className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* 섹션들 */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-xl backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex-1">
                <select
                  value={section.sectionType}
                  onChange={(e) => {
                    const sectionType = e.target.value;
                    const sectionTitles: Record<string, string> = {
                      EDUCATION: '학력',
                      WORK_EXPERIENCE: '경력',
                      PROJECT: '프로젝트',
                      SKILL: '기술',
                      CERTIFICATION: '자격증',
                      AWARD: '수상',
                      ACTIVITY: '활동',
                      CUSTOM: '기타',
                    };
                    updateSection(sectionIndex, 'sectionType', sectionType);
                    updateSection(
                      sectionIndex,
                      'sectionTitle',
                      sectionTitles[sectionType] || '',
                    );
                  }}
                  className="mr-4 rounded-xl border border-purple-200 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="EDUCATION">학력</option>
                  <option value="WORK_EXPERIENCE">경력</option>
                  <option value="PROJECT">프로젝트</option>
                  <option value="SKILL">기술</option>
                  <option value="CERTIFICATION">자격증</option>
                  <option value="AWARD">수상</option>
                  <option value="ACTIVITY">활동</option>
                  <option value="CUSTOM">기타</option>
                </select>
                <Input
                  value={section.sectionTitle}
                  onChange={(e) =>
                    updateSection(sectionIndex, 'sectionTitle', e.target.value)
                  }
                  placeholder="섹션 제목"
                  className="inline-block w-48 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button
                onClick={() => removeSection(sectionIndex)}
                variant="secondary"
                icon={<span>🗑️</span>}
                className="rounded-xl border border-red-200 bg-white/80 px-4 py-2 font-semibold text-red-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
              >
                섹션 삭제
              </Button>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-700">
                      항목 {itemIndex + 1}
                    </h4>
                    <Button
                      onClick={() => removeItem(sectionIndex, itemIndex)}
                      variant="secondary"
                      icon={<span>✕</span>}
                      className="rounded-lg border border-red-200 bg-white px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      삭제
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            'title',
                            e.target.value,
                          )
                        }
                        placeholder="제목 (예: ABC 대학교)"
                        className="rounded-lg"
                      />
                      <Input
                        value={item.subTitle}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            'subTitle',
                            e.target.value,
                          )
                        }
                        placeholder="부제목 (예: 컴퓨터공학과)"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Input
                        type="date"
                        value={item.startDate}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            'startDate',
                            e.target.value,
                          )
                        }
                        placeholder="시작일"
                        className="rounded-lg"
                      />
                      <Input
                        type="date"
                        value={item.endDate}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            'endDate',
                            e.target.value,
                          )
                        }
                        placeholder="종료일"
                        className="rounded-lg"
                      />
                    </div>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          sectionIndex,
                          itemIndex,
                          'description',
                          e.target.value,
                        )
                      }
                      placeholder="상세 설명"
                      rows={3}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={() => addItem(sectionIndex)}
                variant="secondary"
                icon={<span>➕</span>}
                className="w-full rounded-xl border border-purple-200 bg-white/80 py-3 font-semibold text-purple-600 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg"
              >
                항목 추가
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 섹션 추가 버튼 */}
      <div className="flex justify-center">
        <Button
          onClick={addSection}
          variant="primary"
          icon={<span>📝</span>}
          className="transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-blue-600"
        >
          섹션 추가
        </Button>
      </div>
    </div>
  );
}
