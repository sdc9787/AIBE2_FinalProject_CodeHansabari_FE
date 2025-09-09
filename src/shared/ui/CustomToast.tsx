'use client';

import { useEffect } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';

const TOAST_LIMIT = 2; // Or any desired limit

export function CustomToast() {
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider currently visible toasts
      .filter((item, i) => i >= TOAST_LIMIT) // Identify toasts exceeding the limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss those toasts
  }, [toasts]);
  return (
    <div className="body-medium">
      <Toaster
        toastOptions={{
          duration: 3000, // 모든 토스트 공통 지속시간

          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '442px',
            borderRadius: '4px',
            padding: '6px 20px',
            whiteSpace: 'nowrap',
          },

          success: {
            style: {
              background: '#2c336c', // --color-tertiary
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#2c336c', // --color-tertiary
            },
          },

          error: {
            style: {
              background: '#e20c3f', // --color-error
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#e20c3f', // --color-error
            },
          },

          loading: {
            duration: Infinity,
            style: {
              background: '#9b9b9b', // --color-text-tertiary
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#9b9b9b', // --color-text-tertiary
            },
          },
        }}
      />
    </div>
  );
}
