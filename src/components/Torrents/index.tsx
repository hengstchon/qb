import { atom, useAtom } from 'jotai'
import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Pagination from './Pagination'
import Row from './Row'
import DraggableColumnHeader from './DraggableColumnHeader'
import HeaderContextMenu from './ContextMenu'
import { columns } from './columns'
import { Torrent } from '@/types'
import { atomWithStorage } from 'jotai/utils'

export const storageAtom = atomWithStorage('App', {
  table: {
    columnOrder: [],
    columnSizing: {},
    columnVisibility: {},
    columnFilters: [{ id: 'name', value: '' }],
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 20 },
    rowSelection: {},
  },
})

const columnOrderAtom = atom<ColumnOrderState>([])
const columnSizingAtom = atom<ColumnSizingState>({})
const columnVisibilityAtom = atom<VisibilityState>({})
export const colFiltersAtom = atom<ColumnFiltersState>([
  { id: 'name', value: '' },
])
const sortingAtom = atom<SortingState>([])
// const paginationAtom = atom(
//   (get) => get(storageAtom).table.pagination,
//   (_, set, val) => {
//     set(storageAtom, (prev: PaginationState) => ({
//       ...prev,
//       table: { ...prev.table, pagination: val },
//     }))
//   }
// )
const paginationAtom = atom<PaginationState>({ pageSize: 20, pageIndex: 0 })
// const rowSelectionAtom = atom<RowSelectionState>({})
const rowSelectionAtom = atom(
  (get) => get(storageAtom).table.rowSelection,
  (_, set, val: RowSelectionState) => {
    console.log('val:', val)
    set(storageAtom, (prev) => ({
      table: { ...prev.table, rowSelection: val },
    }))
  }
)

const Torrents = ({ torrents }: { torrents: Torrent[] }) => {
  const [columnOrder, onColumnOrderChange] = useAtom(columnOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(columnSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] =
    useAtom(columnVisibilityAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(colFiltersAtom)
  const [sorting, onSortingChange] = useAtom(sortingAtom)
  const [pagination, onPaginationChange] = useAtom(paginationAtom)
  const [rowSelection, onRowSelectionChange] = useAtom(rowSelectionAtom)

  // console.log(pagination)
  console.log(rowSelection)

  const table = useReactTable({
    data: torrents,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onColumnFiltersChange,
    onSortingChange,
    onPaginationChange,
    onRowSelectionChange,
    // debugAll: true,
  })

  table.setOptions((prev) => ({
    ...prev,
    state: {
      ...table.initialState,
      columnOrder,
      columnSizing,
      columnVisibility,
      columnFilters,
      sorting,
      pagination,
      rowSelection,
    },
  }))

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
