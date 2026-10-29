import { useMemo } from 'react'
import { useTable } from '@tanstack/react-table'
import { atom, useAtom, useAtomValue } from 'jotai'
import { focusAtom } from 'jotai-optics'
import DataTable from '@/components/common/DataTable'
import { peersColumns } from '@/config/columns'
import { appTableFeatures } from '@/config/table'
import { useTorPeers } from '@/hooks/useTorPeers'
import { connectionInfoAtom, peerTableStateAtom } from '@/store'
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
  const connectionInfo = useAtomValue(connectionInfoAtom)
  const columns = useMemo(
    () =>
      connectionInfo?.capabilities.supportsPeerHostName
        ? peersColumns
        : peersColumns.filter((column) => column.id !== 'hostName'),
    [connectionInfo?.capabilities.supportsPeerHostName],
  )

  const [columnOrder, onColumnOrderChange] = useAtom(peersColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(peersColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(peersColVisiAtom)
  const [sorting, onSortingChange] = useAtom(peersSortAtom)

  const table = useTable({
    features: appTableFeatures,
    enableRowRangeSelection: false,
    data,
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
  })

  return (
    <div className="grid gap-2">
      <div className="overflow-auto">
        <DataTable<PeerType>
          table={table}
          label="Peers"
          virtualized
          colOrderAtom={peersColOrderAtom}
          currRowAtom={currRowAtom}
        />
      </div>
    </div>
  )
}

export default Peers
