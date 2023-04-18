import React from 'react'
import { cn } from '@/utils'

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'h-10 w-full rounded-md border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
        ref={ref}
      />
    )
  }
)

Input.displayName = 'Input'
