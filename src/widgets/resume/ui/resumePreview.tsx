'use client';
import { MemberInfo, ResumeSection } from '@/entities/resume';

interface ResumePreviewProps {
  memberInfo: MemberInfo;
  sections: ResumeSection[];
}

export function ResumePreview({ memberInfo, sections }: ResumePreviewProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white p-8 shadow-xl backdrop-blur-sm">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
            <span className="text-2xl">👤</span>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          {memberInfo.name || '홍길동'}
        </h1>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{memberInfo.email || 'email@example.com'}</p>
          <p>{memberInfo.phoneNumber || '010-1234-1234'}</p>
          {memberInfo.blogUrl && (
            <p className="text-blue-600">{memberInfo.blogUrl}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              {section.sectionTitle}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.subTitle}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.startDate} ~ {item.endDate}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-700">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <p>이력서 정보를 입력하면 미리보기가 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}
