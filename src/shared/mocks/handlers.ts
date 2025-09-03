import { coverLetterHandlers } from '@/entities';
import { improveCoverLetterHandlers } from '@/features/improve-cover-letter';

export const handlers = [...coverLetterHandlers, ...improveCoverLetterHandlers];
