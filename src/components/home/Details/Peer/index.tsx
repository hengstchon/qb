import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { atom, useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import DataTable from '@/components/common/DataTable'
import { peersColumns } from '@/config/columns'
import { useTorPeers } from '@/hooks/useTorPeers'
import { peerTableStateAtom } from '@/store'
import { PeerType } from '@/types'

const currRowAtom = atom(-1)

const peersColOrderAtom = focusAtom(peerTableStateAtom, (optic) =>
  optic.prop('columnOrder'),
)
const peersColSizingAtom = focusAtom(peerTableStateAtom, (optic) =>
  optic.prop('columnSizing'),
)
const peersColVisiAtom = focusAtom(peerTableStateAtom, (optic) =>
  optic.prop('columnVisibility'),
)
const peersSortAtom = focusAtom(peerTableStateAtom, (optic) =>
  optic.prop('sorting'),
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

  return (
    <div className="grid gap-2">
      <div className="overflow-auto">
        <DataTable<PeerType>
          table={table}
          colOrderAtom={peersColOrderAtom}
          currRowAtom={currRowAtom}
        />
      </div>
    </div>
  )
}

export default Peers
