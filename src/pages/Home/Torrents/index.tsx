import { useAtom } from 'jotai'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Pagination from './Pagination'
import { torsColumns } from './columns'
import {
  torsColFiltersAtom,
  torsColSizingAtom,
  torsColVisiAtom,
  torsPagiAtom,
  torsColOrderAtom,
  torsRowSeleAtom,
  torsSortAtom,
  currTorAtom,
} from './atoms'
import { getTorrentsAtom } from '../atoms'
import BaseTable from '@/components/Table'
import { Torrent } from '@/types'

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
