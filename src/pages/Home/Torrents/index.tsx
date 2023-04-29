import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import BaseTable from '@/components/Table'
import { Torrent } from '@/lib/types'
import { currTorAtom, getTorrentsAtom, tablesAtom } from '../atoms'
import Pagination from './Pagination'
import { torsColumns } from './columns'
import TorrentsActions from './Actions'

const torrentsTableAtom = focusAtom(tablesAtom, (optic) =>
  optic.prop('torrentsTable')
)
const torsColOrderAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnOrder')
)
const torsColSizingAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnSizing')
)
const torsColVisiAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnVisibility')
)
export const torsColFiltersAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnFilters')
)
const torsSortAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('sorting')
)
const torsPagiAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('pagination')
)
const torsRowSeleAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('rowSelection')
)

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
    columns: torsColumns,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      columnFilters,
      sorting,
      pagination,
      rowSelection,
    },
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onColumnFiltersChange,
    onSortingChange,
    onPaginationChange,
    onRowSelectionChange,
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugAll: true,
  })

  return (
    <div className="flex flex-1 flex-col overflow-y-hidden bg-yellow-50">
      <TorrentsActions />
      <div className="flex-1 overflow-auto">
        <BaseTable<Torrent>
          table={table}
          colOrderAtom={torsColOrderAtom}
          currRowAtom={currTorAtom}
        />
      </div>
      <Pagination table={table} />
    </div>
  )
}

export default Torrents
