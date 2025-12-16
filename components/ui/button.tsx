import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'default' | 'large';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'default', loading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plasma-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void',
          'disabled:cursor-not-allowed disabled:opacity-50',

          // Variants
          {
            // Primary - Rocket Orange
            'bg-rocket-orange text-white hover:bg-orange-600 active:bg-orange-700':
              variant === 'primary',

            // Secondary - Outlined
            'border-2 border-plasma-blue text-plasma-blue hover:bg-plasma-blue/10 active:bg-plasma-blue/20':
              variant === 'secondary',

            // Ghost - Transparent
            'text-starlight hover:bg-white/5 active:bg-white/10': variant === 'ghost',

            // Danger - Mars Red
            'bg-mars-red text-white hover:bg-red-600 active:bg-red-700': variant === 'danger',
          },

          // Sizes
          {
            'h-8 px-3 text-sm': size === 'small',
            'h-10 px-4 text-base': size === 'default',
            'h-12 px-6 text-lg': size === 'large',
          },

          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
