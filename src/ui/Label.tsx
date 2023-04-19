import React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelPrimitive.LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
    ref={ref}
  />
))

Label.displayName = 'Label'
