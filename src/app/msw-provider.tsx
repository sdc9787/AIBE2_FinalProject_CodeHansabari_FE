'use client';

import { useEffect, useState } from 'react';

interface MswProviderProps {
  children: React.ReactNode;
}

export function MswProvider({ children }: MswProviderProps) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined'
    ) {
      import('@/shared/mocks/browser').then(({ worker }) => {
        worker
          .start({
            onUnhandledRequest: 'bypass',
          })
          .then(() => setMswReady(true));
      });
    } else {
      setMswReady(true);
    }
  }, []);

  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
