import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import DataTable from '@/components/DataTable'
import { Torrent } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/Table'
import { currTorAtom, getTorrentsAtom, tablesAtom } from '../atoms'
import TorrentsActions from './Actions'
import { torsColumns } from './columns'

const torrentsTableAtom = focusAtom(tablesAtom, (optic) =>
  optic.prop('torrentsTable'),
)
const torsColOrderAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnOrder'),
)
const torsColSizingAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnSizing'),
)
const torsColVisiAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnVisibility'),
)
export const torsColFiltersAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnFilters'),
)
const torsSortAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('sorting'),
)

const Torrents = () => {
  const [columnOrder, onColumnOrderChange] = useAtom(torsColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(torsColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(torsColVisiAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(torsColFiltersAtom)
  const [sorting, onSortingChange] = useAtom(torsSortAtom)

  const [torrents] = useAtom(getTorrentsAtom)
  // console.log(`torrents: ${new Date().toLocaleTimeString()}`, torrents)

  const table = useReactTable({
    data: torrents,
    columns: torsColumns,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      columnFilters,
      sorting,
    },
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onColumnFiltersChange,
    onSortingChange,
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugAll: true,
  })

  const parentRef = React.useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()
  console.log(rows.slice(0, 5))
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
    // debug: true,
  })

  function handleClickRow(
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: Row<Torrent>,
  ) {
    // console.log(e)
    if (e.ctrlKey || e.metaKey) {
      row.toggleSelected()
    } else if (e.shiftKey) {
      const selectedRows = table.getSelectedRowModel()
      console.log(selectedRows)
    } else {
      table.resetRowSelection()
      row.toggleSelected()
    }
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-hidden p-4">
      <TorrentsActions />
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {/* table */}
          <Table style={{ width: table.getTotalSize() }}>
            {/* thead */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                // tr
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => {
                    return (
                      // th
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
            {/* tbody */}
            <TableBody>
              {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index] as Row<Torrent>
                return (
                  // tr
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                    onClick={(e) => handleClickRow(e, row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      // td
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Torrents
