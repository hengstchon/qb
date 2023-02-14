import { Tracker } from '@/types'
import { API } from '@/utils/api'
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import Actions from './Actions'
import { trkscolumns } from './columns'
import {
  currTrkAtom,
  trksColOrderAtom,
  trksColSizingAtom,
  trksColVisiAtom,
  trksRowSeleAtom,
  trksSortAtom,
} from './atoms'
import BaseTable from '@/components/BaseTable'
import { getCurrHashAtom } from '../atoms'

const Trackers = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  // console.log(currHash)

  const { data } = useSWR<Tracker[]>(
    currHash ? API.torrents.trackers(currHash) : null,
    { keepPreviousData: true }
  )

  const [columnOrder, onColumnOrderChange] = useAtom(trksColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(trksColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(trksColVisiAtom)
  const [sorting, onSortingChange] = useAtom(trksSortAtom)
  const [rowSelection, onRowSelectionChange] = useAtom(trksRowSeleAtom)

  const table = useReactTable({
    data: data ?? [],
    columns: trkscolumns,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      sorting,
      rowSelection,
    },
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onSortingChange,
    onRowSelectionChange,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div>
      <Actions />
      <BaseTable<Tracker>
        table={table}
        colOrderAtom={trksColOrderAtom}
        currRowAtom={currTrkAtom}
      />
    </div>
  )
}

export default Trackers
