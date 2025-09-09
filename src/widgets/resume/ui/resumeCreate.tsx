'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResumeItem,
  ResumeData,
  IT_JOB_FIELDS,
  ALL_TECH_STACKS,
  DEFAULT_RESUME_ITEMS,
  DEFAULT_RESUME_DATA,
} from '../model';

export function ResumeCreate() {
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 직무 선택 관련 상태
  const [isJobFieldOpen, setIsJobFieldOpen] = useState(false);
  const [jobFieldSearch, setJobFieldSearch] = useState('');
  const [customJobFields, setCustomJobFields] = useState<string[]>([]);

  // 기술스택 선택 관련 상태
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [techStackSearch, setTechStackSearch] = useState('');
  const [customTechStacks, setCustomTechStacks] = useState<string[]>([]);

  // 필터된 직종 목록 (기본 + 사용자 추가)
  const allJobFields = [...IT_JOB_FIELDS, ...customJobFields];
  const filteredJobFields = allJobFields.filter((job) =>
    job.toLowerCase().includes(jobFieldSearch.toLowerCase()),
  );

  // 필터된 기술스택 목록 (기본 + 사용자 추가)
  const allTechStacks = [...ALL_TECH_STACKS, ...customTechStacks];
  const getFilteredTechStacks = () => {
    return allTechStacks.filter(
      (tech) =>
        tech.toLowerCase().includes(techStackSearch.toLowerCase()) &&
        !resumeData.memberInfo.techStack.includes(tech),
    );
  };

  //항목 편집 리스트
  const [items, setItems] = useState<ResumeItem[]>(DEFAULT_RESUME_ITEMS);

  // 이력서 데이터
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);

  // 토글 버튼 핸들러
  const handleToggle = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, state: !item.state } : item,
      ),
    );
  };

  // 기본정보 입력 핸들러
  const handleMemberInfoChange = (
    field: keyof typeof resumeData.memberInfo,
    value: string,
  ) => {
    setResumeData((prev) => ({
      ...prev,
      memberInfo: {
        ...prev.memberInfo,
        [field]: value,
      },
    }));
  };

  // 기술스택 추가 핸들러
  const handleAddTechStack = (tech: string) => {
    if (tech.trim() && !resumeData.memberInfo.techStack.includes(tech.trim())) {
      setResumeData((prev) => ({
        ...prev,
        memberInfo: {
          ...prev.memberInfo,
          techStack: [...prev.memberInfo.techStack, tech.trim()],
        },
      }));
    }
  };

  // 기술스택 제거 핸들러
  const handleRemoveTechStack = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      memberInfo: {
        ...prev.memberInfo,
        techStack: prev.memberInfo.techStack.filter((_, i) => i !== index),
      },
    }));
  };

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');

    // 전화번호 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      // 11자리 초과 시 11자리까지만 사용
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 전화번호 변경 핸들러
  const handlePhoneNumberChange = (value: string) => {
    const formattedValue = formatPhoneNumber(value);
    handleMemberInfoChange('phoneNumber', formattedValue);
  };

  // 직무 선택 관련 핸들러들
  const handleJobFieldSelect = (job: string) => {
    handleMemberInfoChange('careerType', job);
    setIsJobFieldOpen(false);
    setJobFieldSearch('');
  };

  const handleJobFieldAdd = () => {
    const newJob = jobFieldSearch.trim();
    if (newJob && !allJobFields.includes(newJob)) {
      setCustomJobFields((prev) => [...prev, newJob]);
      handleMemberInfoChange('careerType', newJob);
      setIsJobFieldOpen(false);
      setJobFieldSearch('');
    }
  };

  const handleJobFieldSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setJobFieldSearch(e.target.value);
  };

  const handleJobFieldSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredJobFields.length === 0 && jobFieldSearch.trim()) {
        handleJobFieldAdd();
      } else if (filteredJobFields.length > 0) {
        handleJobFieldSelect(filteredJobFields[0]);
      }
    }
  };

  const handleSearchInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleJobFieldToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJobFieldOpen(!isJobFieldOpen);
  };

  // 기술스택 선택 관련 핸들러들
  const handleTechStackSelect = (tech: string) => {
    handleAddTechStack(tech);
    setIsTechStackOpen(false);
    setTechStackSearch('');
  };

  const handleTechStackAdd = () => {
    const newTech = techStackSearch.trim();
    if (
      newTech &&
      !allTechStacks.includes(newTech) &&
      !resumeData.memberInfo.techStack.includes(newTech)
    ) {
      setCustomTechStacks((prev) => [...prev, newTech]);
      handleAddTechStack(newTech);
      setIsTechStackOpen(false);
      setTechStackSearch('');
    }
  };

  const handleTechStackSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTechStackSearch(e.target.value);
  };

  const handleTechStackSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const filteredTechs = getFilteredTechStacks();
      if (filteredTechs.length === 0 && techStackSearch.trim()) {
        handleTechStackAdd();
      } else if (filteredTechs.length > 0) {
        handleTechStackSelect(filteredTechs[0]);
      }
    }
  };

  const handleTechStackToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTechStackOpen(!isTechStackOpen);
    setIsJobFieldOpen(false);
  };

  // 커스텀 링크 관련 핸들러들
  const handleAddCustomLink = () => {
    const newLink = { title: '', url: '' };
    setResumeData((prev) => ({
      ...prev,
      memberInfo: {
        ...prev.memberInfo,
        customLinks: [...prev.memberInfo.customLinks, newLink],
      },
    }));
  };

  const handleCustomLinkChange = (
    index: number,
    field: 'title' | 'url',
    value: string,
  ) => {
    setResumeData((prev) => ({
      ...prev,
      memberInfo: {
        ...prev.memberInfo,
        customLinks: prev.memberInfo.customLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link,
        ),
      },
    }));
  };

  const handleRemoveCustomLink = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      memberInfo: {
        ...prev.memberInfo,
        customLinks: prev.memberInfo.customLinks.filter((_, i) => i !== index),
      },
    }));
  };

  // 각 항목의 내용이 입력되었는지 확인하는 함수
  const hasContent = (itemName: string): boolean => {
    switch (itemName) {
      case '기본정보':
        return Boolean(
          resumeData.memberInfo.name &&
            resumeData.memberInfo.age &&
            resumeData.memberInfo.email &&
            resumeData.memberInfo.phoneNumber,
        );
      case '학력':
        return resumeData.sections.education.length > 0;
      case '개발직무':
        return Boolean(resumeData.memberInfo.careerType);
      case '기술스택':
        return resumeData.memberInfo.techStack.length > 0;
      case '간단소개':
        return Boolean(resumeData.memberInfo.introduction);
      case '링크':
        return Boolean(
          resumeData.memberInfo.blogUrl ||
            resumeData.memberInfo.githubUrl ||
            resumeData.memberInfo.notionUrl ||
            resumeData.memberInfo.customLinks.length > 0,
        );
      case '경력':
        return resumeData.sections.experience.length > 0;
      case '프로젝트':
        return resumeData.sections.projects.length > 0;
      case '교육이력':
        return resumeData.sections.education.length > 0;
      case '자격증':
        return resumeData.sections.certificates.length > 0;
      case '수상내역':
        return resumeData.sections.awards.length > 0;
      case '기타사항':
        return false; // 기타사항은 별도 구현 필요
      default:
        return false;
    }
  };

  // 외부 클릭으로 셀렉트 박스 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isJobFieldClick = target.closest('[data-select="job-field"]');
      const isTechStackClick = target.closest('[data-select="tech-stack"]');

      if (!isJobFieldClick) {
        setIsJobFieldOpen(false);
      }
      if (!isTechStackClick) {
        setIsTechStackOpen(false);
      }
    };

    if (isJobFieldOpen || isTechStackOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isJobFieldOpen, isTechStackOpen]);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* 좌측 - 항목 편집 */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">항목 편집</h2>

            {/* 항목 편집 컨테이너 */}
            <div className="space-y-2">
              {items.map((item, index) => {
                const hasContentValue = hasContent(item.name);
                const isActive = item.state && hasContentValue;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between rounded-lg border p-2 transition-all duration-200 ${
                      isActive
                        ? 'border-blue-200 bg-blue-50/50'
                        : 'border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* 상태 표시 아이콘 */}
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />

                      {/* 항목 이름 */}
                      <span
                        className={`text-xs font-medium ${
                          isActive ? 'text-gray-800' : 'text-gray-500'
                        }`}
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
                        onClick={() => handleToggle(index)}
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

            {/* 선택된 항목 수 표시 */}
            <div className="mt-4 rounded-lg bg-gray-100 p-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  완료:{' '}
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
                  필수:{' '}
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
                value={resumeData.title}
                onChange={(e) =>
                  setResumeData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="이력서 제목을 입력하세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            {/* 기본정보 섹션 */}
            {items.find((item) => item.name === '기본정보')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800"></h2>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <input
                      placeholder="이름을 입력해 주세요"
                      type="text"
                      value={resumeData.memberInfo.name}
                      onChange={(e) =>
                        handleMemberInfoChange('name', e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      나이(연도)
                    </label>
                    <input
                      type="number"
                      value={resumeData.memberInfo.age}
                      onChange={(e) =>
                        handleMemberInfoChange('age', e.target.value)
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
                      value={resumeData.memberInfo.email}
                      onChange={(e) =>
                        handleMemberInfoChange('email', e.target.value)
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
                      value={resumeData.memberInfo.phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {items.find((item) => item.name === '간단소개')?.state && (
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      기술소개문서 (간단소개)
                    </label>
                    <textarea
                      value={resumeData.memberInfo.introduction}
                      onChange={(e) =>
                        handleMemberInfoChange('introduction', e.target.value)
                      }
                      rows={4}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="간단한 자기소개를 입력하세요"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 링크 섹션 */}
            {items.find((item) => item.name === '링크')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  링크
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <i className="xi-github xi-3x"></i>
                    <div className="flex-1">
                      <label className="mb-1 block px-3 text-sm font-medium text-gray-700">
                        Github
                      </label>
                      <input
                        type="url"
                        value={resumeData.memberInfo.githubUrl}
                        onChange={(e) =>
                          handleMemberInfoChange('githubUrl', e.target.value)
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
                        value={resumeData.memberInfo.blogUrl}
                        onChange={(e) =>
                          handleMemberInfoChange('blogUrl', e.target.value)
                        }
                        placeholder="https://blog.example.com"
                        className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="/icon/notion.svg"
                      alt="Notion"
                      className="h-12 w-12"
                    />
                    <div className="flex-1">
                      <label className="mb-1 block px-3 text-sm font-medium text-gray-700">
                        Notion
                      </label>
                      <input
                        type="url"
                        value={resumeData.memberInfo.notionUrl}
                        onChange={(e) =>
                          handleMemberInfoChange('notionUrl', e.target.value)
                        }
                        placeholder="https://notion.so/username"
                        className="w-full rounded px-3 py-2 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 커스텀 링크들 */}
                  {resumeData.memberInfo.customLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <i className="xi-link xi-3x text-gray-600"></i>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) =>
                            handleCustomLinkChange(
                              index,
                              'title',
                              e.target.value,
                            )
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
            {items.find((item) => item.name === '개발직무')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  개발직무
                </h2>

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
                          resumeData.memberInfo.careerType
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }
                      >
                        {resumeData.memberInfo.careerType ||
                          '직무를 선택해주세요'}
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
                              onKeyDown={handleJobFieldSearchKeyDown}
                              onClick={handleSearchInputClick}
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
                                style={{
                                  animationDelay: `${index * 20}ms`,
                                }}
                              >
                                {job}
                              </button>
                            ))}
                            {filteredJobFields.length === 0 &&
                              jobFieldSearch.trim() && (
                                <div className="p-2">
                                  <button
                                    type="button"
                                    onClick={handleJobFieldAdd}
                                    className="w-full rounded-lg border-2 border-dashed border-blue-300 px-4 py-3 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
                                  >
                                    + "{jobFieldSearch}" 직무 추가
                                  </button>
                                </div>
                              )}
                            {filteredJobFields.length === 0 &&
                              !jobFieldSearch.trim() && (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                  검색 결과가 없습니다.
                                </div>
                              )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {/* 기술스택 섹션 */}
            {items.find((item) => item.name === '기술스택')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  기술스택
                </h2>

                {/* 기술스택 선택 및 추가 */}
                <div className="mb-6 space-y-4">
                  {/* 커스텀 드롭다운으로 기술스택 선택 */}
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
                                onKeyDown={handleTechStackSearchKeyDown}
                                onClick={handleSearchInputClick}
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
                                  style={{
                                    animationDelay: `${index * 20}ms`,
                                  }}
                                >
                                  {tech}
                                </button>
                              ))}
                              {getFilteredTechStacks().length === 0 &&
                                techStackSearch.trim() && (
                                  <div className="p-2">
                                    <button
                                      type="button"
                                      onClick={handleTechStackAdd}
                                      className="w-full rounded-lg border-2 border-dashed border-blue-300 px-4 py-3 text-sm text-blue-600 transition-all duration-150 hover:border-blue-400 hover:bg-blue-50"
                                    >
                                      + "{techStackSearch}" 기술스택 추가
                                    </button>
                                  </div>
                                )}
                              {getFilteredTechStacks().length === 0 &&
                                !techStackSearch.trim() && (
                                  <div className="px-4 py-3 text-sm text-gray-500">
                                    사용 가능한 기술스택이 없습니다.
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* 선택된 기술스택 표시 */}
                {resumeData.memberInfo.techStack.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      선택된 기술스택 ({resumeData.memberInfo.techStack.length}
                      개)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.memberInfo.techStack.map((tech, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                        >
                          {tech}
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

            {/* 학력 섹션 */}
            {items.find((item) => item.name === '학력')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  학력
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="학교명"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="전공"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="재학기간"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                      <option>졸업</option>
                      <option>재학</option>
                      <option>휴학</option>
                      <option>중퇴</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 경력 섹션 */}
            {items.find((item) => item.name === '경력')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">경력</h2>
                  <span className="text-sm font-medium text-green-600">
                    신입 작성 중
                  </span>
                </div>
                <textarea
                  placeholder="경력 사항을 입력하세요"
                  rows={4}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* 프로젝트 섹션 */}
            {items.find((item) => item.name === '프로젝트')?.state && (
              <div className="mb-8 rounded-lg border border-gray-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    프로젝트
                  </h2>
                  <span className="text-sm font-medium text-green-600">
                    개인 프로젝트 중
                  </span>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="프로젝트 제목"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="프로젝트 기간"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="프로젝트 링크"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="프로젝트 설명을 입력하세요"
                    rows={4}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 저장 버튼 */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
