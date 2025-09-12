'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TechStackTagsProps {
  techStacks: Array<{ techStackId: number }>;
  allTechStacks: Array<{ id: number; name: string }>;
  onRemove: (index: number) => void;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
  className?: string;
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    button: 'text-blue-600 hover:text-blue-800',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    button: 'text-green-600 hover:text-green-800',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    button: 'text-purple-600 hover:text-purple-800',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    button: 'text-orange-600 hover:text-orange-800',
  },
};

export default function TechStackTags({
  techStacks,
  allTechStacks,
  onRemove,
  colorScheme = 'blue',
  className = '',
}: TechStackTagsProps) {
  const colors = colorSchemes[colorScheme];

  if (!techStacks || techStacks.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="flex flex-wrap gap-2">
        {techStacks.map((techStack, index) => {
          const techStackInfo = allTechStacks.find(
            (tech) => tech.id === techStack.techStackId,
          );
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`inline-flex items-center gap-1 rounded-full ${colors.bg} px-3 py-1 text-sm ${colors.text}`}
            >
              {techStackInfo?.name || `Tech ${techStack.techStackId}`}
              <motion.button
                type="button"
                onClick={() => onRemove(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className={`ml-1 ${colors.button}`}
              >
                ×
              </motion.button>
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}
