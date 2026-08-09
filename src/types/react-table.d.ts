import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // Generic names must match TanStack's mergeable declaration.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
  }
}
