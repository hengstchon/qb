import { useMemo } from 'react'
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { atom, useAtom, useAtomValue } from 'jotai'
import { focusAtom } from 'jotai-optics'
import useSWR from 'swr'
import DataTable from '@/components/common/DataTable'
import { trksColumns } from '@/config/columns'
import { noCapabilities } from '@/domain/capabilities'
import { API } from '@/services'
import { normalizeTrackers } from '@/services/normalizers'
import {
  connectionInfoAtom,
  getCurrHashAtom,
  trackerTableStateAtom,
} from '@/store'
import { Tracker } from '@/types'
import Actions from './Actions'

const trksColOrderAtom = focusAtom(trackerTableStateAtom, (optic) =>
  optic.prop('columnOrder'),
)
const trksColSizingAtom = focusAtom(trackerTableStateAtom, (optic) =>
  optic.prop('columnSizing'),
)
const trksColVisiAtom = focusAtom(trackerTableStateAtom, (optic) =>
  optic.prop('columnVisibility'),
)
const trksSortAtom = focusAtom(trackerTableStateAtom, (optic) =>
  optic.prop('sorting'),
)

export const currTrkAtom = atom(-1)

const Trackers = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  // console.log(currHash)

  const { data } = useSWR<unknown>(
    currHash ? API.torrents.trackers(currHash) : null,
    { keepPreviousData: true, fallbackData: [], refreshInterval: 5000 },
  )
  const trackers = useMemo(() => normalizeTrackers(data), [data])
  const connectionInfo = useAtomValue(connectionInfoAtom)
  const columns = useMemo(
    () =>
      connectionInfo?.capabilities.supportsDetailedTrackers
        ? trksColumns
        : trksColumns.filter(
            (column) =>
              !['nextAnnounce', 'minAnnounce', 'endpoints'].includes(
                column.id!,
              ),
          ),
    [connectionInfo?.capabilities.supportsDetailedTrackers],
  )

  const [columnOrder, onColumnOrderChange] = useAtom(trksColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(trksColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(trksColVisiAtom)
  const [sorting, onSortingChange] = useAtom(trksSortAtom)

  const table = useReactTable({
    data: trackers,
    columns,
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
      <Actions
        table={table}
        capabilities={connectionInfo?.capabilities ?? noCapabilities}
      />
      <div className="overflow-auto">
        <DataTable<Tracker>
          table={table}
          label="Trackers"
          colOrderAtom={trksColOrderAtom}
          currRowAtom={currTrkAtom}
        />
      </div>
    </div>
  )
}

export default Trackers
