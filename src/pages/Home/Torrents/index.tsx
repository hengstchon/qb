import React, { useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  pointerWithin,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import {
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  Row,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { ArrowDownIcon, ArrowUpIcon, GripVerticalIcon } from 'lucide-react'
import { VList } from 'virtua'
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
  getFilteredTorsAtom,
  isHeaderEditingAtom,
  tablesAtom,
  torsTableAtom,
} from '../atoms'
import { torsColumns } from './columns'
import DefaultActionBar from './DefaultActionBar'
import RowsSelectedActionBar from './RowsSelectedActionBar'

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

function NormalTableHeader() {
  const torsTable = useAtomValue(torsTableAtom)
  return (
    <TableHeader className="sticky top-0 z-10 h-8 select-none bg-background">
      {torsTable?.getHeaderGroups().map((headerGroup) => (
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

function TableHeaderDndContext({ children }: { children: JSX.Element }) {
  const [columnOrder, setColumnOrder] = useAtom(torsColOrderAtom)

  const reorderColumn = (
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[],
  ): ColumnOrderState => {
    columnOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
    )
    return [...columnOrder]
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeId = active.id
    const overId = over?.id
    if (!overId || activeId === overId) return

    setColumnOrder(
      reorderColumn(
        activeId as string,
        overId as string,
        columnOrder as string[],
      ),
    )
  }

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  )
}

function EditTableColumnHeader({
  header,
}: {
  header: Header<Torrent, string>
}) {
  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: header.id,
  })

  const { isOver, setNodeRef: dropRef } = useDroppable({
    id: header.id,
  })

  return (
    <TableHead
      ref={dropRef}
      className={cn(
        'relative px-0',
        isDragging && 'opacity-50',
        isOver && !isDragging && 'border border-primary',
      )}
      style={{
        width: header.getSize(),
        transform: transform
          ? `translate3d(${transform.x}px, 0, 0)`
          : undefined,
      }}
    >
      <div ref={dragRef} {...listeners} {...attributes}>
        <GripVerticalIcon className="h-4 w-4 cursor-move" />
      </div>
      {flexRender(header.column.columnDef.header, header.getContext())}
      {!isDragging && !isOver && (
        <div
          onMouseDown={header.getResizeHandler()}
          className="absolute right-0 flex h-full w-0.5 cursor-col-resize bg-muted-foreground"
        />
      )}
    </TableHead>
  )
}

function EditTableHeader() {
  const torsTable = useAtomValue(torsTableAtom)
  return (
    <TableHeaderDndContext>
      <TableHeader className="sticky top-0 z-10 h-8 select-none bg-background">
        {torsTable?.getHeaderGroups().map((headerGroup) => (
          // tr
          <TableRow key={headerGroup.id} className="select-none">
            {headerGroup.headers.map((header) => {
              // th
              return <EditTableColumnHeader key={header.id} header={header} />
            })}
          </TableRow>
        ))}
      </TableHeader>
    </TableHeaderDndContext>
  )
}

function TorrentsTableHeader() {
  const isHeaderEditing = useAtomValue(isHeaderEditingAtom)
  return isHeaderEditing ? <EditTableHeader /> : <NormalTableHeader />
}

const Torrents = () => {
  const [columnOrder, onColumnOrderChange] = useAtom(torsColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(torsColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(torsColVisiAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(torsColFiltersAtom)
  const [sorting, onSortingChange] = useAtom(torsSortAtom)

  const [torrents] = useAtom(getFilteredTorsAtom)
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

  const setTorsTable = useSetAtom(torsTableAtom)
  useEffect(() => {
    setTorsTable(table)
  }, [table, setTorsTable])

  const isSomeRowsSelected = table.getIsSomeRowsSelected()

  const { rows } = table.getRowModel()

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
      {/* Action Bar */}
      {isSomeRowsSelected ? (
        <RowsSelectedActionBar />
      ) : (
        <DefaultActionBar rowNum={rows.length} />
      )}
      <div className="flex-1 overflow-auto rounded border">
        <Table className="relative table h-full">
          {/* thead */}
          <TorrentsTableHeader />
          {/* tbody */}
          <TableBody className="relative h-full">
            <VList>
              {rows.map((row) => {
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
                        className="h-[36px]"
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
            </VList>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Torrents
