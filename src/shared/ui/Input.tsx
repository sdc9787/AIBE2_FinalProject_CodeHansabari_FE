import { cn } from '@/shared/lib';
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

// Input Props
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

// Textarea Props
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

const inputStyles = {
  base: 'w-full rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200',
  variants: {
    default: 'border-gray-300 bg-white text-gray-700 focus:border-blue-500',
    filled:
      'border-gray-200 bg-gray-50 text-gray-700 focus:border-blue-500 focus:bg-white',
  },
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-3',
    lg: 'px-4 py-4',
  },
  error: 'border-red-500 focus:border-red-500 focus:ring-red-200',
};

const labelStyles = 'mb-1 block text-sm font-medium text-gray-700';
const errorStyles = 'mt-1 text-sm text-red-600';
const helperStyles = 'mt-1 text-sm text-gray-500';

// Input Component
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, variant = 'default', className, id, ...props },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            inputStyles.base,
            inputStyles.variants[variant],
            inputStyles.sizes.md,
            error && inputStyles.error,
            className,
          )}
          {...props}
        />
        {error && <p className={errorStyles}>{error}</p>}
        {helperText && !error && <p className={helperStyles}>{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      className,
      id,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            inputStyles.base,
            inputStyles.variants[variant],
            inputStyles.sizes.md,
            error && inputStyles.error,
            'resize-vertical',
            className,
          )}
          {...props}
        />
        {error && <p className={errorStyles}>{error}</p>}
        {helperText && !error && <p className={helperStyles}>{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
