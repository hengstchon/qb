import { useAtomValue } from 'jotai'
import { noCapabilities } from '@/domain/capabilities'
import { setTorrentsRunning, type TorrentHashes } from '@/services/torrents'
import { connectionInfoAtom, torsTableAtom } from '@/store'

export const useTorrentActions = () => {
  const connectionInfo = useAtomValue(connectionInfoAtom)
  const table = useAtomValue(torsTableAtom)
  const capabilities = connectionInfo?.capabilities ?? noCapabilities

  const setRunning = (hashes: TorrentHashes, running: boolean) =>
    setTorrentsRunning(hashes, running, capabilities)

  const setSelectedRunning = (running: boolean) => {
    const hashes =
      table?.getSelectedRowModel().rows.map((row) => row.original.hash) ?? []
    return setRunning(hashes, running)
  }

  return { setRunning, setSelectedRunning }
}
