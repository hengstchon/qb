import {
  ColumnOrderState,
  Table as ReactTable,
  flexRender,
} from '@tanstack/react-table'
import { PrimitiveAtom, WritableAtom } from 'jotai'
import React, { SetStateAction } from 'react'
import HeaderColumn from './HeaderColumn'
import Row from './Row'
import { selectColumnDef } from './selectColumn'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/Table'

const BaseTable = <T,>({
  table,
  colOrderAtom,
  currRowAtom,
  virtualize,
}: {
  table: ReactTable<T>
  colOrderAtom: WritableAtom<
    ColumnOrderState,
    [arg: SetStateAction<ColumnOrderState>],
    void
  >
  currRowAtom: PrimitiveAtom<number>
  virtualize?: boolean
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()
  window.table = table

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    // overscan: 10,
    // debug: true,
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
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

export default BaseTable
export { selectColumnDef }
