import type { SetStateAction } from 'react'
import {
  flexRender,
  type ColumnOrderState,
  type Table as ReactTable,
  type RowData,
} from '@tanstack/react-table'
import type { PrimitiveAtom, WritableAtom } from 'jotai'
import { VList } from 'virtua'
import type { AppTableFeatures } from '@/config/table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/Table'
import { cn } from '@/utils'

const DataTable = <T extends RowData>({
  table,
  label,
  virtualized = false,
}: {
  table: ReactTable<AppTableFeatures, T>
  label: string
  virtualized?: boolean
  colOrderAtom: WritableAtom<
    ColumnOrderState,
    [arg: SetStateAction<ColumnOrderState>],
    void
  >
  currRowAtom: PrimitiveAtom<number>
}) => {
  const rows = table.getRowModel().rows
  const renderRow = (row: (typeof rows)[number]) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )

  return (
    <div className="rounded-md">
      <Table
        aria-label={label}
        aria-rowcount={rows.length}
        style={{ width: table.getTotalSize() }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={cn(virtualized && rows.length && 'h-[300px]')}>
          {rows.length ? (
            virtualized ? (
              <VList className="h-full" data-testid={`${label}-virtual-list`}>
                {rows.map(renderRow)}
              </VList>
            ) : (
              rows.map(renderRow)
            )
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default DataTable
