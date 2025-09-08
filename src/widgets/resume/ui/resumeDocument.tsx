'use client';
import { MemberInfo, ResumeSection, ResumeItem } from '@/entities/resume';

interface ResumeDocumentProps {
  title: string;
  memberInfo: MemberInfo;
  sections: ResumeSection[];
  onTitleChange: (title: string) => void;
  onMemberInfoChange: (memberInfo: MemberInfo) => void;
  onSectionsChange: (sections: ResumeSection[]) => void;
  isEditable?: boolean;
}

export function ResumeDocument({
  title,
  memberInfo,
  sections,
  onTitleChange,
  onMemberInfoChange,
  onSectionsChange,
  isEditable = false,
}: ResumeDocumentProps) {
  const updateSectionItem = (
    sectionIndex: number,
    itemIndex: number,
    updatedItem: ResumeItem,
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].items[itemIndex] = updatedItem;
    onSectionsChange(updatedSections);
  };

  const EditableField = ({
    value,
    onChange,
    className = '',
    placeholder = '',
    isTextarea = false,
    rows = 3,
  }: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    isTextarea?: boolean;
    rows?: number;
  }) => {
    if (!isEditable) {
      return <span className={className}>{value || placeholder}</span>;
    }

    if (isTextarea) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${className} min-h-[1.5em] w-full resize-none rounded border-none bg-transparent px-1 outline-none hover:bg-gray-50 focus:border focus:border-blue-300 focus:bg-white focus:shadow-sm`}
          placeholder={placeholder}
          rows={rows}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} w-full rounded border-none bg-transparent px-1 outline-none hover:bg-gray-50 focus:border focus:border-blue-300 focus:bg-white focus:shadow-sm`}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div className="mx-auto h-[297mm] w-[210mm] overflow-hidden bg-white p-8 font-sans text-gray-800 shadow-lg">
      {/* 이력서 제목 */}
      <div className="mb-6 text-center">
        <EditableField
          value={title}
          onChange={onTitleChange}
          className="text-center text-2xl font-bold text-gray-900"
          placeholder="이력서 제목을 입력하세요"
        />
      </div>

      {/* 헤더 - 개인정보 */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <EditableField
              value={memberInfo.name}
              onChange={(value) =>
                onMemberInfoChange({ ...memberInfo, name: value })
              }
              className="mb-4 block w-full text-3xl font-bold text-gray-900"
              placeholder="이름을 입력하세요"
            />

            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-16 text-sm font-medium text-gray-600">
                  이메일:
                </span>
                <EditableField
                  value={memberInfo.email}
                  onChange={(value) =>
                    onMemberInfoChange({ ...memberInfo, email: value })
                  }
                  className="flex-1 text-sm text-gray-700"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div className="flex items-center">
                <span className="w-16 text-sm font-medium text-gray-600">
                  전화:
                </span>
                <EditableField
                  value={memberInfo.phoneNumber || ''}
                  onChange={(value) =>
                    onMemberInfoChange({ ...memberInfo, phoneNumber: value })
                  }
                  className="flex-1 text-sm text-gray-700"
                  placeholder="전화번호를 입력하세요"
                />
              </div>

              <div className="flex items-center">
                <span className="w-16 text-sm font-medium text-gray-600">
                  웹사이트:
                </span>
                <EditableField
                  value={memberInfo.blogUrl || ''}
                  onChange={(value) =>
                    onMemberInfoChange({ ...memberInfo, blogUrl: value })
                  }
                  className="flex-1 text-sm text-blue-600 underline"
                  placeholder="웹사이트 URL을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 사진 자리 */}
          <div className="ml-6 flex h-32 w-24 items-center justify-center border border-gray-300 bg-gray-200">
            <span className="text-xs text-gray-500">사진</span>
          </div>
        </div>
      </div>

      {/* 섹션들 */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={`${section.sectionType}-${sectionIndex}`} className="mb-6">
            {/* 섹션 제목 */}
            <h2 className="mb-4 border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-900">
              {section.sectionTitle}
            </h2>

            {/* 섹션 항목들 */}
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="border-l-2 border-gray-200 pl-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <EditableField
                      value={item.title}
                      onChange={(value) =>
                        updateSectionItem(sectionIndex, itemIndex, {
                          ...item,
                          title: value,
                        })
                      }
                      className="flex-1 text-lg font-semibold text-gray-900"
                      placeholder="제목을 입력하세요"
                    />

                    <div className="ml-4 flex min-w-[200px] gap-2 text-sm text-gray-600">
                      <EditableField
                        value={item.startDate}
                        onChange={(value) =>
                          updateSectionItem(sectionIndex, itemIndex, {
                            ...item,
                            startDate: value,
                          })
                        }
                        className="w-20 text-sm text-gray-600"
                        placeholder="시작일"
                      />
                      <span>-</span>
                      <EditableField
                        value={item.endDate}
                        onChange={(value) =>
                          updateSectionItem(sectionIndex, itemIndex, {
                            ...item,
                            endDate: value,
                          })
                        }
                        className="w-20 text-sm text-gray-600"
                        placeholder="종료일"
                      />
                    </div>
                  </div>

                  <EditableField
                    value={item.subTitle}
                    onChange={(value) =>
                      updateSectionItem(sectionIndex, itemIndex, {
                        ...item,
                        subTitle: value,
                      })
                    }
                    className="mb-2 block text-base font-medium text-gray-700"
                    placeholder="부제목을 입력하세요"
                  />

                  <EditableField
                    value={item.description}
                    onChange={(value) =>
                      updateSectionItem(sectionIndex, itemIndex, {
                        ...item,
                        description: value,
                      })
                    }
                    className="block w-full text-sm leading-relaxed text-gray-600"
                    placeholder="설명을 입력하세요"
                    isTextarea={true}
                    rows={2}
                  />
                </div>
              ))}

              {section.items.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  항목이 없습니다. 왼쪽 패널에서 항목을 추가해주세요.
                </div>
              )}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p>섹션이 없습니다.</p>
            <p className="mt-2 text-sm">왼쪽 패널에서 섹션을 추가해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
