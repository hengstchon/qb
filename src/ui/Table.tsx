import React from 'react'
import { cn } from '@/utils'

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const Table = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  ),
)
Table.displayName = 'Table'

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="rowgroup"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  ),
)
TableHeader.displayName = 'TableHeader'

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="rowgroup"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  ),
)
TableBody.displayName = 'TableBody'

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="row"
      className={cn(
        'bg-primary text-primary-foreground font-medium',
        className,
      )}
      {...props}
    />
  ),
)
TableFooter.displayName = 'TableFooter'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="columnheader"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted flex truncate border-b select-none',
        className,
      )}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {}
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="cell"
      className={cn(
        'text-muted-foreground flex h-8 items-center px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'p-2 align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('text-muted-foreground mt-4 text-sm', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
