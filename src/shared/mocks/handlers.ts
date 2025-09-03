import { coverLetterHandlers } from '@/entities';
import { improveCoverLetterHandlers } from '@/features/improve-cover-letter';
import { saveCoverLetterHandler } from '@/features/save-cover-letter';

export const handlers = [
  ...coverLetterHandlers,
  ...improveCoverLetterHandlers,
  ...saveCoverLetterHandler,
];
