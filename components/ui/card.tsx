import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-lg',

          // Variants
          {
            // Default - Cosmos background
            'bg-cosmos': variant === 'default',
            // Elevated - Nebula background with shadow
            'bg-nebula shadow-lg': variant === 'elevated',
            // Outlined - Transparent with border
            'border border-nebula bg-transparent': variant === 'outlined',
          },

          // Interactive states
          {
            'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl':
              interactive,
          },

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, children, ...props }: CardHeaderProps): JSX.Element {
  return (
    <div className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, children, ...props }: CardTitleProps): JSX.Element {
  return (
    <h3 className={cn('text-lg font-semibold text-starlight', className)} {...props}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps): JSX.Element {
  return (
    <p className={cn('mt-1 text-sm text-stardust', className)} {...props}>
      {children}
    </p>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps): JSX.Element {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps): JSX.Element {
  return (
    <div className={cn('flex items-center gap-2 p-6 pt-4', className)} {...props}>
      {children}
    </div>
  );
}
