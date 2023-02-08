import { Torrent } from '@/types'
import { API } from '@/utils/api'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableState,
  useReactTable,
} from '@tanstack/react-table'
import { atomWithStorage } from 'jotai/utils'
import useSWR from 'swr'
import Pagination from './Pagination'
import Row from './Row'
import DraggableColumnHeader from './DraggableColumnHeader'
import HeaderContextMenu from './ContextMenu'
import { columns } from './columns'
import { useAtom } from 'jotai'

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

const Torrents = () => {
  const { data, isLoading } = useSWR(API.torrentInfo(), {
    refreshInterval: 1000,
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
          <div className="thead">
            <HeaderContextMenu table={table}>
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
            </HeaderContextMenu>
          </div>
          <div className="tbody">
            {table.getRowModel().rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </div>
        </div>
      </div>
      <Pagination table={table} />
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
                <span className="ml-4">
                  {JSON.stringify(t[k as keyof Torrent])}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Torrents
