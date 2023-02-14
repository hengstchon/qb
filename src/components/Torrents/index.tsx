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
  torsColFiltersAtom,
  torsColSizingAtom,
  torsColVisiAtom,
  torsPagiAtom,
  torsColOrderAtom,
  torsRowSeleAtom,
  torsSortAtom,
} from './atoms'
import HeaderColumn from './HeaderColumn'
import HeaderDndContext from './HeaderDndContext'
import { getTorrentsAtom } from '../Homepage/atoms'

const Torrents = () => {
  const [columnOrder, onColumnOrderChange] = useAtom(torsColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(torsColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(torsColVisiAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(torsColFiltersAtom)
  const [sorting, onSortingChange] = useAtom(torsSortAtom)
  const [pagination, onPaginationChange] = useAtom(torsPagiAtom)
  const [rowSelection, onRowSelectionChange] = useAtom(torsRowSeleAtom)

  const [torrents] = useAtom(getTorrentsAtom)

  // console.log(`torrents: ${new Date().toLocaleTimeString()}`, torrents)

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
  console.log(rowSelection)

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
