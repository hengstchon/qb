import { useMemo } from 'react'
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { atom, useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { PeerType } from '@/lib/types'
import BaseTable from '@/components/Table'
import { useTorPeers } from '@/hooks/useTorPeers'
import { tablesAtom } from '@/pages/Home/atoms'
import { peersColumns } from './columns'

const currRowAtom = atom(-1)

const torrentsTableAtom = focusAtom(tablesAtom, (optic) =>
  optic.prop('peersTable')
)
const peersColOrderAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnOrder')
)
const peersColSizingAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnSizing')
)
const peersColVisiAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnVisibility')
)
const peersSortAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('sorting')
)

const Peers = () => {
  const data = useTorPeers()

  const [columnOrder, onColumnOrderChange] = useAtom(peersColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(peersColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(peersColVisiAtom)
  const [sorting, onSortingChange] = useAtom(peersSortAtom)

  const table = useReactTable({
    data,
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

  const virtualize = table.getRowModel().flatRows.length > 20

  return (
    <div className="grid gap-2">
      <div className="overflow-auto">
        <BaseTable<PeerType>
          table={table}
          colOrderAtom={peersColOrderAtom}
          currRowAtom={currRowAtom}
          virtualize={virtualize}
        />
      </div>
    </div>
  )
}

export default Peers
