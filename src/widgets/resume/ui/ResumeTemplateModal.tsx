'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ResumeType } from '@/entities';

interface ResumeTemplateModalProps {
  onSelect: (type: ResumeType) => void;
  onCancel: () => void;
}

export function ResumeTemplateModal({
  onSelect,
  onCancel,
}: ResumeTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeType | null>(
    null,
  );

  const templates = [
    {
      type: 'DEFAULT' as ResumeType,
      name: '클래식 템플릿',
      description:
        '깔끔하고 전통적인 디자인으로 모든 업종에 적합합니다. 가장 정석적인 레이아웃으로 정보를 체계적으로 정리합니다.',
      preview: '/images/template-default.png', // 이미지 경로는 실제에 맞게 수정
      isRecommended: false,
    },
    {
      type: 'MODERN' as ResumeType,
      name: '모던 템플릿',
      description:
        '세련되고 현대적인 디자인으로 창의적인 분야나 스타트업에 특히 효과적입니다. 깔끔한 타이포그래피가 특징입니다.',
      preview: '/images/template-modern.png', // 이미지 경로는 실제에 맞게 수정
      isRecommended: true,
    },
  ];

  const handleTemplateSelect = (type: ResumeType) => {
    setSelectedTemplate(type);
  };

  const handleSave = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">이력서 템플릿 선택</h2>
        <p className="mt-2 text-gray-600">
          채용 담당자 선별을 수 있는 템플릿을 선택하세요. 각 색상은 다른 도움이
          됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <motion.div
            key={template.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTemplateSelect(template.type)}
            className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {template.isRecommended && (
              <div className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                추천
              </div>
            )}

            {/* 선택 표시 */}
            {selectedTemplate === template.type && (
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* 템플릿 미리보기 영역 */}
            <div className="mb-4 aspect-[3/4] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {template.type === 'DEFAULT' ? (
                <div className="flex h-full flex-col justify-center p-6">
                  {/* 클래식 템플릿 미리보기 */}
                  <div className="mb-4 h-4 w-3/4 rounded bg-gray-300"></div>
                  <div className="mb-2 h-2 w-full rounded bg-gray-200"></div>
                  <div className="mb-2 h-2 w-5/6 rounded bg-gray-200"></div>
                  <div className="mb-4 h-2 w-2/3 rounded bg-gray-200"></div>

                  <div className="mb-2 h-3 w-1/2 rounded bg-gray-400"></div>
                  <div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
                  <div className="mb-1 h-2 w-4/5 rounded bg-gray-200"></div>
                  <div className="mb-4 h-2 w-3/4 rounded bg-gray-200"></div>

                  <div className="mb-2 h-3 w-1/3 rounded bg-gray-400"></div>
                  <div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
                  <div className="h-2 w-5/6 rounded bg-gray-200"></div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-center p-6">
                  {/* 모던 템플릿 미리보기 */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-300"></div>
                    <div className="h-4 w-1/2 rounded bg-blue-400"></div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="h-2 rounded bg-blue-200"></div>
                    <div className="h-2 rounded bg-blue-200"></div>
                    <div className="h-2 rounded bg-blue-200"></div>
                  </div>

                  <div className="mb-2 h-3 w-1/3 rounded bg-blue-500"></div>
                  <div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
                  <div className="mb-4 h-2 w-4/5 rounded bg-gray-200"></div>

                  <div className="mb-2 h-3 w-2/5 rounded bg-blue-500"></div>
                  <div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
                  <div className="h-2 w-3/4 rounded bg-gray-200"></div>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {template.name}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {template.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          취소
        </motion.button>

        <motion.button
          onClick={handleSave}
          disabled={!selectedTemplate}
          whileHover={selectedTemplate ? { scale: 1.02 } : {}}
          whileTap={selectedTemplate ? { scale: 0.98 } : {}}
          className={`rounded-xl px-8 py-3 font-semibold transition-all duration-200 ${
            selectedTemplate
              ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
        >
          템플릿 선택 완료
        </motion.button>
      </div>
    </div>
  );
}
