import { Torrent } from '@/types'
import { cn, formatBytes, formatPercentage, formatTimestamp } from '@/utils'
import { API } from '@/utils/api'
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  TableState,
  useReactTable,
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import useSWR from 'swr'

const ch = createColumnHelper<Torrent>()

const columns = [
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
    header: 'Progress',
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
    header: 'Seeds',
  }),
  ch.accessor((row) => `${row.num_leechs}(${row.num_incomplete})`, {
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
    header: 'DL Limit',
  }),
  ch.accessor('up_limit', {
    header: 'UP_limit',
  }),
  ch.accessor('downloaded_session', {
    header: 'Downloaded Session',
  }),
  ch.accessor('uploaded_limit', {
    header: 'Uploaded Limit',
  }),
  ch.accessor('time_active', {
    header: 'Time Active',
  }),
  ch.accessor('amount_left', {
    header: 'Remaining',
    cell: (p) => formatBytes(p.getValue()),
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
    header: 'Seen Complete',
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

const headers = columns.map((c) => c.header)

// console.log(columns)
console.log(headers)

const tableStateAtom = atomWithStorage<TableState>('tableState', {
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
  columnFilters: [],
  columnPinning: {
    left: [],
    right: [],
  },
  columnOrder: [],
  columnVisibility: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  globalFilter: null,
})

const Torrents = () => {
  const { data, isLoading } = useSWR(API.torrentInfo(), {
    fallbackData: [],
  })

  const [state, setState] = useAtom(tableStateAtom)

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
  }))

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-yellow-50">
      <div className="w-full flex-1 overflow-x-auto">
        <div
          className="table border"
          style={{ width: table.getCenterTotalSize() }}
        >
          <div className="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="tr flex">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="th group relative truncate border capitalize"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        'absolute right-0 top-0 h-full w-[5px] cursor-col-resize touch-none select-none bg-black bg-opacity-50 opacity-0 group-hover:opacity-100',
                        header.column.getIsResizing()
                          ? 'bg-blue-500 opacity-100'
                          : ''
                      )}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="tbody">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="tr flex">
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="truncate border"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
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
          {[1, 2].map((pageSize) => (
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
