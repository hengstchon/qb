import React from 'react'
import {
  Column,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  Row,
  RowSelectionState,
  Table as TableType,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAtom, useAtomValue } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { ArrowDownIcon, ArrowUpIcon, GripVerticalIcon } from 'lucide-react'
import DataTable from '@/components/DataTable'
import { Torrent } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/ui/ContextMenu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/Table'
import {
  currTorAtom,
  getTorrentsAtom,
  isHeaderEditingAtom,
  tablesAtom,
} from '../atoms'
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

interface TableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  header: Header<TData, TValue>
}

function NormalTableHeader({ table }: { table: TableType<Torrent> }) {
  return (
    <TableHeader className="sticky top-0 z-10 select-none bg-background">
      {table.getHeaderGroups().map((headerGroup) => (
        // tr
        <TableRow key={headerGroup.id} className="select-none">
          {headerGroup.headers.map((header) => {
            const column = header.column
            return (
              // th
              <TableHead key={header.id} style={{ width: header.getSize() }}>
                {header.isPlaceholder ? null : (
                  <Button
                    key={header.id}
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-6 px-2 data-[state=open]:bg-accent"
                    onClick={column.getToggleSortingHandler()}
                  >
                    <span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </span>
                    {column.getIsSorted() === 'desc' ? (
                      <ArrowDownIcon className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === 'asc' ? (
                      <ArrowUpIcon className="ml-1 h-4 w-4" />
                    ) : null}
                  </Button>
                )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}

function EditTableHeader({ table }: { table: TableType<Torrent> }) {
  return (
    <TableHeader className="sticky top-0 z-10 select-none bg-background">
      {table.getHeaderGroups().map((headerGroup) => (
        // tr
        <TableRow key={headerGroup.id} className="select-none">
          {headerGroup.headers.map((header) => {
            return (
              // th
              <TableHead
                key={header.id}
                className="px-0"
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder ? null : (
                  <div className="relative flex h-full w-full items-center px-1">
                    <GripVerticalIcon className="h-4 w-4 cursor-move" />
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      className="absolute right-0 flex h-full w-0.5 cursor-col-resize bg-muted-foreground"
                    />
                  </div>
                )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}

function TorrentsTableHeader({ table }: { table: TableType<Torrent> }) {
  const isHeaderEditing = useAtomValue(isHeaderEditingAtom)
  return isHeaderEditing ? (
    <EditTableHeader table={table} />
  ) : (
    <NormalTableHeader table={table} />
  )
}

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
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 20,
    // debug: true,
  })

  function handleClickRow(
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: Row<Torrent>,
  ) {
    if (e.ctrlKey || e.metaKey) {
      row.toggleSelected()
    } else if (e.shiftKey) {
      const selectedRowModel = table.getSelectedRowModel()
      const selectedRows = selectedRowModel.rows
      if (selectedRows.length < 1) {
        row.toggleSelected()
      } else if (selectedRows.length == 1) {
        const selectedId = selectedRows[0].id
        const selectedIndex = rows.findIndex((row) => row.id == selectedId)
        const clickId = row.id
        const clickIndex = rows.findIndex((row) => row.id == clickId)
        const minIndex = Math.min(selectedIndex, clickIndex)
        const maxIndex = Math.max(selectedIndex, clickIndex)
        const newSelectionIndices = rows
          .slice(minIndex, maxIndex + 1)
          .map((row) => row.id)
        const newSelection = newSelectionIndices.reduce((res, item) => {
          res[item] = true
          return res
        }, {} as RowSelectionState)
        table.setRowSelection(newSelection)
      } else {
        table.resetRowSelection()
        row.toggleSelected()
      }
    } else {
      table.resetRowSelection()
      row.toggleSelected()
    }
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-hidden p-4">
      <TorrentsActions />
      <div ref={parentRef} className="flex-1 overflow-auto rounded-md border">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {/* table */}
          <Table
            className="relative h-full"
            style={{ width: table.getTotalSize() }}
          >
            {/* thead */}
            <TorrentsTableHeader table={table} />
            {/* tbody */}
            <TableBody>
              {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index] as Row<Torrent>
                return (
                  <ContextMenu
                    key={row.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) return
                      // console.log(table.getSelectedRowModel().rows)
                      const selectedRows = table.getSelectedRowModel().rows
                      if (selectedRows.length) {
                        const selectedIds = selectedRows.map((row) => row.id)
                        const isCurRowInSelected = selectedIds.includes(row.id)
                        if (!isCurRowInSelected) {
                          table.resetRowSelection()
                          row.toggleSelected()
                        }
                      } else {
                        row.toggleSelected()
                      }
                    }}
                  >
                    <ContextMenuTrigger asChild>
                      {/* tr */}
                      <TableRow
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
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      {JSON.stringify(
                        table
                          .getSelectedRowModel()
                          .rows.map((row) => row.original.name),
                      )}
                    </ContextMenuContent>
                  </ContextMenu>
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
