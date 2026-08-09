import { useAtomValue } from 'jotai'
import { noCapabilities } from '@/domain/capabilities'
import {
  deleteTorrents,
  setTorrentsRunning,
  type TorrentHashes,
} from '@/services/torrents'
import { connectionInfoAtom, torsTableAtom } from '@/store'

export const useTorrentActions = () => {
  const connectionInfo = useAtomValue(connectionInfoAtom)
  const table = useAtomValue(torsTableAtom)
  const capabilities = connectionInfo?.capabilities ?? noCapabilities

  const setRunning = (hashes: TorrentHashes, running: boolean) =>
    setTorrentsRunning(hashes, running, capabilities)

  const setSelectedRunning = (running: boolean) => {
    const hashes = getSelectedHashes()
    return setRunning(hashes, running)
  }

  const getSelectedHashes = () =>
    table?.getSelectedRowModel().rows.map((row) => row.original.hash) ?? []

  const deleteSelected = async (deleteFiles: boolean) => {
    await deleteTorrents(getSelectedHashes(), deleteFiles)
    table?.resetRowSelection()
  }

  return { deleteSelected, setRunning, setSelectedRunning }
}
