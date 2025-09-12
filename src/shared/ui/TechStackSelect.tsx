'use client';

import React from 'react';

interface TechStackSelectProps {
  techStacks: Array<{ id: number; name: string }>;
  selectedTechStacks?: Array<{ techStackId: number }>;
  onSelect: (tech: any) => void;
  placeholder?: string;
  className?: string;
}

export default function TechStackSelect({
  techStacks,
  selectedTechStacks = [],
  onSelect,
  placeholder = '기술스택을 선택하세요',
  className = '',
}: TechStackSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const techId = parseInt(e.target.value);
    const tech = techStacks.find((t) => t.id === techId);
    if (tech && !selectedTechStacks.some((ts) => ts.techStackId === techId)) {
      onSelect(tech);
    }
    e.target.value = '';
  };

  const availableTechStacks = techStacks.filter(
    (tech) => !selectedTechStacks.some((ts) => ts.techStackId === tech.id),
  );

  return (
    <div className={`relative ${className}`}>
      <select
        onChange={handleChange}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {availableTechStacks.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.name}
          </option>
        ))}
      </select>
    </div>
  );
}
