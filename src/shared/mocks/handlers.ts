import {
  adminHandlers,
  coverLetterEntitiesHandlers,
  coverLetterHandlers,
  interviewQuestionsHandlers,
  resumeHandlers,
  userHandlers,
} from '@/entities';

import {
  improveCoverLetterHandlers,
  loginGoogleHandler,
  saveCoverLetterHandler,
} from '@/features';
import { coverLetterFeaturesHandlers } from '@/features';

export const handlers = [
  ...coverLetterHandlers,
  ...coverLetterFeaturesHandlers,
  ...coverLetterEntitiesHandlers,
  ...resumeHandlers,
  ...interviewQuestionsHandlers,
  ...improveCoverLetterHandlers,
  ...saveCoverLetterHandler,
  ...loginGoogleHandler,
  ...userHandlers,
  ...adminHandlers,
];
