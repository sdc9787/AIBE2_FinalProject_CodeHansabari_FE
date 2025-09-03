import { Suspense } from 'react';
import { GoogleCallback } from '@/pages';

export default function GoogleCallBack() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <GoogleCallback />
    </Suspense>
  );
}
