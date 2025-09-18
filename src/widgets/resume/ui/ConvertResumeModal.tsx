'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConvertResumeMutation } from '@/features/convert-resume';
import toast from 'react-hot-toast';

interface ConvertResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConvertResumeModal({
  isOpen,
  onClose,
  onSuccess,
}: ConvertResumeModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertMutation = useConvertResumeMutation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // 파일 형식 검증
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        '지원하지 않는 파일 형식입니다. PDF 또는 이미지 파일만 업로드 가능합니다.',
      );
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB 이하만 허용됩니다.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('파일을 선택해주세요.');
      return;
    }

    convertMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        onSuccess();
        onClose();
      },
    });
  };

  const handleModalClose = () => {
    if (convertMutation.isPending) return;
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">이력서 변환</h2>
          <button
            onClick={handleModalClose}
            disabled={convertMutation.isPending}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-600">
            PDF 또는 이미지 형태의 이력서를 업로드하여 CVMento 이력서 형식으로
            변환합니다.
          </p>
          <div className="text-xs text-gray-500">
            <p>• 지원 형식: PDF, JPG, JPEG, PNG, GIF, BMP, WEBP</p>
            <p>• 파일 크기: 10MB 이하</p>
          </div>
        </div>

        {/* 파일 드롭 영역 */}
        <div
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={convertMutation.isPending}
          />

          {selectedFile ? (
            <div className="space-y-2">
              <div className="text-green-600">
                <svg
                  className="mx-auto mb-2 h-12 w-12"
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
              <p className="font-medium text-gray-700">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                disabled={convertMutation.isPending}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                파일 제거
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400">
                <svg
                  className="mx-auto mb-2 h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                {dragOver
                  ? '파일을 여기에 놓으세요'
                  : '파일을 드래그하거나 클릭하여 선택'}
              </p>
              <p className="text-sm text-gray-500">PDF 또는 이미지 파일</p>
            </div>
          )}
        </div>

        {/* 변환 진행 상태 */}
        <AnimatePresence>
          {convertMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3"
            >
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-sm text-blue-700">
                  이력서를 변환하고 있습니다...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 버튼 */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleModalClose}
            disabled={convertMutation.isPending}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || convertMutation.isPending}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {convertMutation.isPending ? '변환 중...' : '변환하기'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
