'use client';

import { useState } from 'react';
import { Button, Input } from '@/shared/ui';

interface TitleInputModalProps {
  onSave: (title: string) => void;
  onCancel: () => void;
  defaultTitle?: string;
}

export function TitleInputModal({
  onSave,
  onCancel,
  defaultTitle = '',
}: TitleInputModalProps) {
  const [title, setTitle] = useState(defaultTitle);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">자기소개서 저장</h2>
        <p className="mt-2 text-sm text-gray-600">
          AI 첨삭 완료된 자기소개서를 저장하시겠습니까?
        </p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          제목
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="자기소개서_2025_8_26"
          className="w-full"
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!title.trim()}
          variant="primary"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          저장하기
        </Button>
        <Button
          onClick={onCancel}
          variant="secondary"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          취소
        </Button>
      </div>
    </div>
  );
}
