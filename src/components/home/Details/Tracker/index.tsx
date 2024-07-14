import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { atom, useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import useSWR from 'swr'
import DataTable from '@/components/common/DataTable'
import { trksColumns } from '@/config/columns'
import { API } from '@/services'
import { getCurrHashAtom, trackerTableAtom } from '@/store/global'
import { Tracker } from '@/types'
import Actions from './Actions'

const trksColOrderAtom = focusAtom(trackerTableAtom, (optic) =>
  optic.prop('columnOrder'),
)
const trksColSizingAtom = focusAtom(trackerTableAtom, (optic) =>
  optic.prop('columnSizing'),
)
const trksColVisiAtom = focusAtom(trackerTableAtom, (optic) =>
  optic.prop('columnVisibility'),
)
const trksSortAtom = focusAtom(trackerTableAtom, (optic) =>
  optic.prop('sorting'),
)

export const currTrkAtom = atom(-1)

const Trackers = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  // console.log(currHash)

  const { data } = useSWR<Tracker[]>(
    currHash ? API.torrents.trackers(currHash) : null,
    { keepPreviousData: true, fallbackData: [] },
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
        <DataTable<Tracker>
          table={table}
          colOrderAtom={trksColOrderAtom}
          currRowAtom={currTrkAtom}
        />
      </div>
    </div>
  )
}

export default Trackers
