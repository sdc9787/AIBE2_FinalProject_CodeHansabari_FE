"use client";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/queryClient';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure a stable query client per Provider instance on client side.
  const [client] = useState(() => getQueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
