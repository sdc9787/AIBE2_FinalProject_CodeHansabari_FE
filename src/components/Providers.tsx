"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure a stable query client per Provider instance on client side.
  const [client] = useState(() => getQueryClient());
  // Lazy-init MSW only in browser (or server if enabled) once.
  useEffect(() => {
    // Dynamic import so this code is tree-shaken / skipped if not enabled.
    import("@/mocks/initMsw").then((m) => m.initMsw());
  }, []);
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
