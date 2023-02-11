import { useAtom } from 'jotai'
import {
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
import {
  columnFiltersAtom,
  columnOrderAtom,
  columnSizingAtom,
  columnVisibilityAtom,
  paginationAtom,
  rowSelectionAtom,
  sortingAtom,
} from './atoms'
import { DndContext } from '@dnd-kit/core'

const Torrents = ({ torrents }: { torrents: Torrent[] }) => {
  const [columnOrder, onColumnOrderChange] = useAtom(columnOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(columnSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] =
    useAtom(columnVisibilityAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(columnFiltersAtom)
  const [sorting, onSortingChange] = useAtom(sortingAtom)
  const [pagination, onPaginationChange] = useAtom(paginationAtom)
  const [rowSelection, onRowSelectionChange] = useAtom(rowSelectionAtom)

  const table = useReactTable({
    data: torrents,
    columns,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      columnFilters,
      sorting,
      pagination,
      rowSelection,
    },
    autoResetPageIndex: false,
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

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-yellow-50">
      <div className="flex-1 overflow-auto">
        <div className="table border border-dotted">
          <div className="thead">
            <DndContext>
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
            </DndContext>
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

export default Torrents
