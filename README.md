This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Added Tooling & Libraries

The project has been extended with:

- `@tanstack/react-query` (+ devtools) for server state management.
- `zustand` for lightweight client state.
- `clsx` for conditional className composition.
- `framer-motion` for animations.
- `jest`, `@testing-library/*`, `msw` for testing with mocked network requests.

### React Query
Wrapped in a `Providers` component (`src/components/Providers.tsx`). Example usage on `app/page.tsx` fetching `/api/hello`.

### Zustand
Counter store at `src/store/useCounterStore.ts` used on the home page.

### MSW (Mock Service Worker)
Handlers defined in `src/mocks/handlers.ts` and wired for Jest in `jest.setup.ts`. Tests run without hitting real network.

### Testing
Run tests:

```bash
npm test
```

Example test: `src/tests/home.test.tsx` validates mocked API + UI render.

## Development

Start dev server:

```bash
npm run dev
```

## Notes

- Jest uses a separate tsconfig (`tsconfig.jest.json`) with `commonjs` modules.
- IntersectionObserver polyfilled in `jest.setup.ts` for `framer-motion`.
- To add new MSW handlers, update `src/mocks/handlers.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
