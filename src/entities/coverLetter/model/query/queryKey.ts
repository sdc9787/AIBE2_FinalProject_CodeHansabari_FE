export const coverLetterQueryKeys = {
  list: (page: number) => ['coverLetters', 'list', page] as const,
  detail: (coverLetterId: number) =>
    ['coverLetters', 'detail', coverLetterId] as const,
};
