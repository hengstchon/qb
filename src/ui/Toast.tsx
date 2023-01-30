import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'

const ToastProvider = ToastPrimitive.Provider
const ToastRoot = ToastPrimitive.Root
const ToastTitle = ToastPrimitive.Title
const ToastDescription = ToastPrimitive.Description
const ToastAction = ToastPrimitive.Action
const ToastClose = ToastPrimitive.Close
const ToastViewport = ToastPrimitive.Viewport

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {}

// const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(({ className, ...props }, ref) => (
// ))

// interface LabelProps
//   extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}
//
// export const Label = React.forwardRef<
//   React.ElementRef<typeof LabelPrimitive.Root>,
//   LabelProps
// >(({ className, ...props }, ref) => (
//   <LabelPrimitive.Root
//     className={cn('text-sm font-medium leading-none', className)}
//     {...props}
//     ref={ref}
//   />
// ))
//
// Label.displayName = 'Label'

export {
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
}
