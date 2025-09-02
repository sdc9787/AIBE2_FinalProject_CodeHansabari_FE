export const coverLetterQueryKeys = {
  list: ['coverLetters', 'list'] as const,
  detail: (coverLetterId: number) =>
    ['coverLetters', 'detail', coverLetterId] as const,
};
