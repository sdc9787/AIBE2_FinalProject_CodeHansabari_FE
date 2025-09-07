import { useLogout } from '../model';

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logout.isPending}
      className={`disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {logout.isPending ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
}
