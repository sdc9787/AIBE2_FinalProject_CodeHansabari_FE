import { UserInfo } from './ui';

export function Header() {
  return (
    <>
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            CV Mento
          </div>
          <UserInfo />
        </div>
      </header>
    </>
  );
}
