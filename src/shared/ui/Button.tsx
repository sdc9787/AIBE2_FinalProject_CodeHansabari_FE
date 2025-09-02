import { cn } from '@/shared/lib';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'small';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  outline:
    'border border-white bg-transparent text-white hover:bg-white hover:text-blue-600',
  ghost: 'bg-white text-blue-600 hover:bg-gray-100',
  small: 'bg-gray-500 text-white hover:bg-gray-600',
};

const buttonSizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed';

  return (
    <button
      className={cn(
        baseStyles,
        buttonVariants[variant],
        buttonSizes[size],
        icon && 'flex items-center gap-2',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && icon && icon}
      {children}
    </button>
  );
}
