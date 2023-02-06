import { Torrent } from '@/types'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/ui/ContextMenu'
import { cn, formatBytes, formatPercentage, formatTimestamp } from '@/utils'
import { API } from '@/utils/api'
import {
  Column,
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  Table,
  TableState,
  useReactTable,
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import useSWR from 'swr'
import { useDrag, useDrop } from 'react-dnd'
import { FC, useMemo } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Checkbox } from '@/ui/Checkbox'

const ch = createColumnHelper<Torrent>()

const columns = [
  ch.display({
    id: 'select',
    enableSorting: false,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsSomeRowsSelected()
            ? 'indeterminate'
            : table.getIsAllRowsSelected()
        }
        onCheckedChange={(e) => {
          table.toggleAllRowsSelected(e as boolean)
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
        disabled={!row.getCanSelect()}
      />
    ),
  }),
  ch.accessor('name', {
    header: 'Name',
  }),
  ch.accessor('size', {
    header: 'Size',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('total_size', {
    header: 'Total Size',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('progress', {
    header: 'Done',
    cell: (p) => formatPercentage(p.getValue()),
  }),
  ch.accessor('downloaded', {
    header: 'Downloaded',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('uploaded', {
    header: 'Uploaded',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('state', {
    header: 'Status',
  }),
  ch.accessor((row) => `${row.num_seeds}(${row.num_complete})`, {
    id: 'seeds',
    header: 'Seeds',
  }),
  ch.accessor((row) => `${row.num_leechs}(${row.num_incomplete})`, {
    id: 'peers',
    header: 'Peers',
  }),
  ch.accessor('dlspeed', {
    header: 'Down Speed',
  }),
  ch.accessor('upspeed', {
    header: 'Up Speed',
  }),
  ch.accessor('eta', {
    header: 'ETA',
  }),
  ch.accessor('ratio', {
    header: 'Ratio',
  }),
  ch.accessor('category', {
    header: 'Category',
  }),
  ch.accessor('tags', {
    header: 'Tags',
  }),
  ch.accessor('added_on', {
    header: 'Added On',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('completion_on', {
    header: 'Completed On',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('tracker', {
    header: 'Tracker',
  }),
  ch.accessor('dl_limit', {
    header: 'Down Limit',
  }),
  ch.accessor('up_limit', {
    header: 'Up limit',
  }),
  ch.accessor('downloaded_session', {
    header: 'Session Download',
  }),
  ch.accessor('uploaded_session', {
    header: 'Session Upload',
  }),
  ch.accessor('amount_left', {
    header: 'Remaining',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('time_active', {
    header: 'Time Active',
  }),
  ch.accessor('save_path', {
    header: 'Save Path',
  }),
  ch.accessor('completed', {
    header: 'Completed',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('ratio_limit', {
    header: 'Ratio Limit',
  }),
  ch.accessor('seen_complete', {
    header: 'Last Seen Complete',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('last_activity', {
    header: 'Last Activity',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('availability', {
    header: 'Availability',
  }),
]

const initialState: TableState = {
  columnSizing: {},
  columnSizingInfo: {
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: [],
  },
  rowSelection: {},
  expanded: {},
  grouping: [],
  sorting: [],
  columnFilters: [{ id: 'name', value: '' }],
  columnPinning: {
    left: [],
    right: [],
  },
  columnOrder: [],
  columnVisibility: {},
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  globalFilter: null,
}

export const tableStateAtom = atomWithStorage<TableState>(
  'tableState',
  initialState
)

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

const DraggableColumnHeader: FC<{
  header: Header<Torrent, unknown>
  table: Table<Torrent>
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table
  let { columnOrder } = getState()
  const { column } = header

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Torrent>) => {
      if (!columnOrder.length) {
        columnOrder = table.getAllColumns().map((c) => c.id)
      }
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      )
      setColumnOrder(newColumnOrder)
    },
  })

  return (
    <div
      key={header.id}
      ref={dropRef}
      className="th group relative border border-dotted"
      style={{ width: header.getSize(), opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        ref={isDragging ? previewRef : dragRef}
        className={cn(
          'flex select-none items-center gap-1 px-1 text-sm font-semibold',
          isDragging ? 'cursor-move' : 'cursor-pointer'
        )}
        onClick={header.column.getToggleSortingHandler()}
      >
        <span className="truncate">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {{
          asc: <ArrowUpIcon className="h-4 w-4 flex-none" />,
          desc: <ArrowDownIcon className="h-4 w-4 flex-none" />,
        }[header.column.getIsSorted() as string] ?? null}
      </div>
      {header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            'absolute right-0 top-0 h-full w-[5px] cursor-col-resize touch-none select-none bg-black bg-opacity-50 opacity-0 group-hover:opacity-100',
            header.column.getIsResizing() ? 'bg-blue-500 opacity-100' : ''
          )}
        />
      )}
    </div>
  )
}

const Torrents = () => {
  const { data, isLoading } = useSWR(API.torrentInfo(), {
    fallbackData: [],
  })

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugAll: true,
  })

  const [state, setState] = useAtom<TableState>(tableStateAtom)

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
  }))

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-yellow-50">
      <div className="flex-1 overflow-auto">
        <div className="table border border-dotted">
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="thead">
                {table.getHeaderGroups().map((headerGroup) => (
                  <div key={headerGroup.id} className="tr flex">
                    {headerGroup.headers.map((header) => {
                      return header.id === 'select' ? (
                        <div
                          key={header.id}
                          className="th group relative flex items-center justify-center border border-dotted px-1"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      ) : (
                        <DraggableColumnHeader
                          key={header.id}
                          header={header}
                          table={table}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="">
              {table.getAllColumns().map((c) => {
                const { id, header } = c.columnDef
                return (
                  <ContextMenuCheckboxItem
                    key={c.id}
                    className="capitalize"
                    checked={c.getIsVisible()}
                    onClick={c.getToggleVisibilityHandler()}
                  >
                    {typeof header == 'string' ? header : id}
                  </ContextMenuCheckboxItem>
                )
              })}
            </ContextMenuContent>
          </ContextMenu>

          <div className="tbody">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="tr flex">
                {row.getVisibleCells().map((cell) => {
                  const isFirstCol = cell.column.id === 'select'
                  return (
                    <div
                      key={cell.id}
                      className="flex items-center border border-dotted px-1"
                      style={
                        isFirstCol
                          ? undefined
                          : { width: cell.column.getSize() }
                      }
                    >
                      {isFirstCol ? (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : (
                        <span className="truncate text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 bg-green-50">
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="w-16 rounded border p-1"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      {/* <Log tors={data} /> */}
    </div>
  )
}

const Log = ({ tors }: { tors: Torrent[] }) => {
  return (
    <div>
      {tors.slice(0, -1).map((t, i) => (
        <div key={i}>
          <span>-------------------------------</span>
          <div key={i} className="mb-4">
            {Object.keys(t).map((k, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span>{k}:</span>
                <span className="ml-4">{JSON.stringify(t[k])}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Torrents
