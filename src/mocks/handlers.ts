import { rest } from 'msw';

export const handlers = [
  rest.get('/api/hello', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Hello from MSW mock!' })
    );
  })
];
