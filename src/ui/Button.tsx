import React from 'react'
import { cn } from '@/utils'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          'h-10 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
        ref={ref}
      />
    )
  }
)

Button.displayName = 'Button'
