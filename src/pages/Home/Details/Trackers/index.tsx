import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import useSWR from 'swr'
import { atom, useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { Tracker } from '@/lib/types'
import { API } from '@/api/endpoints'
import BaseTable from '@/components/Table'
import { getCurrHashAtom, tablesAtom } from '@/pages/Home/atoms'
import Actions from './Actions'
import { trksColumns } from './columns'

const torrentsTableAtom = focusAtom(tablesAtom, (optic) =>
  optic.prop('trackersTable')
)
const trksColOrderAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnOrder')
)
const trksColSizingAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnSizing')
)
const trksColVisiAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnVisibility')
)
const trksSortAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('sorting')
)

export const currTrkAtom = atom(-1)

const Trackers = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  // console.log(currHash)

  const { data } = useSWR<Tracker[]>(
    currHash ? API.torrents.trackers(currHash) : null,
    { keepPreviousData: true, fallbackData: [] }
  )

  const [columnOrder, onColumnOrderChange] = useAtom(trksColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(trksColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(trksColVisiAtom)
  const [sorting, onSortingChange] = useAtom(trksSortAtom)

  const table = useReactTable({
    data: data!,
    columns: trksColumns,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      sorting,
    },
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onSortingChange,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="grid gap-2">
      <Actions />
      <div className="overflow-auto">
        <BaseTable<Tracker>
          table={table}
          colOrderAtom={trksColOrderAtom}
          currRowAtom={currTrkAtom}
        />
      </div>
    </div>
  )
}

export default Trackers
