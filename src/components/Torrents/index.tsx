import { useAtom } from 'jotai'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Pagination from './Pagination'
import Row from './Row'
import HeaderContextMenu from './HeaderContextMenu'
import { columns } from './columns'
import {
  columnFiltersAtom,
  columnOrderAtom,
  columnSizingAtom,
  columnVisibilityAtom,
  paginationAtom,
  rowSelectionAtom,
  sortingAtom,
} from './atoms'
import HeaderColumn from './HeaderColumn'
import HeaderDndContext from './HeaderDndContext'
import { torrentsAtom } from '../Homepage/atoms'

const Torrents = () => {
  const [columnOrder, onColumnOrderChange] = useAtom(columnOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(columnSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] =
    useAtom(columnVisibilityAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(columnFiltersAtom)
  const [sorting, onSortingChange] = useAtom(sortingAtom)
  const [pagination, onPaginationChange] = useAtom(paginationAtom)
  const [rowSelection, onRowSelectionChange] = useAtom(rowSelectionAtom)

  const [torrents] = useAtom(torrentsAtom)
  // console.log(`torrents: ${new Date().toLocaleTimeString()}`, torrents)

  const table = useReactTable({
    data: Object.values(torrents),
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
    <div className="flex flex-1 flex-col bg-yellow-50">
      <div className="flex-1 overflow-auto">
        <div className="table border border-dotted">
          {/* header */}
          <HeaderContextMenu table={table}>
            <HeaderDndContext>
              <div className="relative flex">
                {table.getLeafHeaders().map((header) => (
                  <HeaderColumn key={header.id} header={header} />
                ))}
              </div>
            </HeaderDndContext>
          </HeaderContextMenu>

          {/* rows */}
          {table.getRowModel().rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </div>
      </div>
      <Pagination table={table} />
    </div>
  )
}

export default Torrents
