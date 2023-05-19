import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import DataTable from '@/components/DataTable'
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

const Torrents = () => {
  const [columnOrder, onColumnOrderChange] = useAtom(torsColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(torsColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(torsColVisiAtom)
  const [columnFilters, onColumnFiltersChange] = useAtom(torsColFiltersAtom)
  const [sorting, onSortingChange] = useAtom(torsSortAtom)
  const [pagination, onPaginationChange] = useAtom(torsPagiAtom)

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
    },
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onColumnFiltersChange,
    onSortingChange,
    onPaginationChange,
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugAll: true,
  })

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-hidden p-4">
      <TorrentsActions />
      <div className="flex-1 overflow-auto">
        <DataTable<Torrent>
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
