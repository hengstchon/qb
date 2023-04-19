import BaseTable from '@/components/Table'
import { useTorPeers } from '@/hooks/useTorPeers'
import { Peer } from '@/types'
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import {
  currRowAtom,
  peersColOrderAtom,
  peersColSizingAtom,
  peersColVisiAtom,
  peersSortAtom,
} from './atoms'
import { peersColumns } from './columns'

const Peers = () => {
  const peers = useTorPeers()
  const peersArr = useMemo(() => Object.values(peers), [peers])

  const [columnOrder, onColumnOrderChange] = useAtom(peersColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(peersColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(peersColVisiAtom)
  const [sorting, onSortingChange] = useAtom(peersSortAtom)

  const table = useReactTable({
    data: peersArr,
    columns: peersColumns,
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
      <div className="overflow-auto">
        <BaseTable<Peer>
          table={table}
          colOrderAtom={peersColOrderAtom}
          currRowAtom={currRowAtom}
        />
      </div>
    </div>
  )
}

export default Peers
