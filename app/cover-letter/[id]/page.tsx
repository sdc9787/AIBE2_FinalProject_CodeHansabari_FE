import { CoverLetterPage } from '@/pages';
import { use } from 'react';

export default function CoverLetterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // id가 유효한 숫자가 아니면 404나 에러 처리를 할 수 있습니다
  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            잘못된 자소서 ID입니다
          </h1>
          <p className="mt-2 text-gray-600">올바른 자소서 ID를 입력해주세요.</p>
        </div>
      </div>
    );
  }

  return <CoverLetterPage id={Number(id)} />;
}
