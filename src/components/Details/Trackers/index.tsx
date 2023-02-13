import { currentTorHashAtom } from '@/components/Torrents/atoms'
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
import { columns } from './columns'
import Table from './Table'

const Trackers = () => {
  const [currentTorHash] = useAtom(currentTorHashAtom)
  const { data } = useSWR<Tracker[]>(
    currentTorHash ? API.torrents.trackers(currentTorHash) : null,
    { keepPreviousData: true }
  )

  // const table = useReactTable({
  //   data: data ?? [],
  //   columns,
  //   state: {
  //     columnOrder,
  //     columnSizing,
  //     columnVisibility,
  //     sorting,
  //     rowSelection,
  //   },
  //   columnResizeMode: 'onChange',
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   onColumnOrderChange,
  //   onColumnSizingChange,
  //   onColumnVisibilityChange,
  //   onSortingChange,
  //   onRowSelectionChange,
  // })

  return (
    <div>
      <Actions />
      <Table />
    </div>
  )
}

export default Trackers
