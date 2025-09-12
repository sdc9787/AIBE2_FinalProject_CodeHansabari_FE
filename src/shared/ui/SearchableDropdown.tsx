'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  selectedValue?: string;
  options: Array<{ id: string | number; name: string }>;
  onSelect: (option: any) => void;
  className?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SearchableDropdown({
  label,
  placeholder,
  searchPlaceholder,
  selectedValue,
  options,
  onSelect,
  className = '',
  searchValue,
  onSearchChange,
  isOpen,
  onToggle,
}: SearchableDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          onClick={onToggle}
          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-left text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span className={selectedValue ? 'text-gray-900' : 'text-gray-500'}>
            {selectedValue || placeholder}
          </span>
          <motion.span
            className="absolute right-3 text-gray-400"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
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
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <div className="max-h-60 overflow-x-hidden overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option)}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-150 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {option.name}
                  </button>
                ))}
                {options.length === 0 && (
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
  );
}
