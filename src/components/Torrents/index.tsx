import { Torrent } from '@/types'
import { cn, formatBytes, formatPercentage, formatTimestamp } from '@/utils'
import { API } from '@/utils/api'
import {
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
  ch.accessor('name', {}),
  ch.accessor('size', {
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('total_size', {
    header: 'total size',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('progress', {
    cell: (p) => formatPercentage(p.getValue()),
  }),
  ch.accessor('downloaded', {
    header: 'downloaded',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('uploaded', {
    header: 'uploaded',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('state', {
    header: 'status',
  }),
  ch.accessor((row) => `${row.num_seeds}(${row.num_complete})`, {
    header: 'seeds',
  }),
  ch.accessor((row) => `${row.num_leechs}(${row.num_incomplete})`, {
    header: 'peers',
  }),
  ch.accessor('dlspeed', {
    header: 'down speed',
  }),
  ch.accessor('upspeed', {
    header: 'up speed',
  }),
  ch.accessor('eta', {}),
  ch.accessor('ratio', {}),
  ch.accessor('category', {}),
  ch.accessor('tags', {}),
  ch.accessor('added_on', {
    header: 'Added On',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('completion_on', {
    header: 'Completed On',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('tracker', {}),
  ch.accessor('dl_limit', {}),
  ch.accessor('up_limit', {}),
  ch.accessor('downloaded_session', {}),
  ch.accessor('uploaded_limit', {}),
  ch.accessor('time_active', {}),
  ch.accessor('amount_left', {
    header: 'Remaining',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('save_path', {}),
  ch.accessor('completed', {}),
  ch.accessor('ratio_limit', {}),
  ch.accessor('seen_complete', {}),
  ch.accessor('last_activity', {}),
  ch.accessor('availability', {}),
]

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
    <div className="min-w-0 flex-1 bg-yellow-50">
      <div className="w-full overflow-x-auto">
        <table
          className="text-sm"
          style={{ width: table.getCenterTotalSize() }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="group relative border capitalize"
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-2">
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
      </div>
      <Log tors={data} />
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
