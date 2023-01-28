import React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/utils'

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
    ref={ref}
  />
))

Label.displayName = 'Label'
