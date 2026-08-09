import { useAtomValue, useSetAtom } from 'jotai'
import type {
  BatchActionFeedback,
  BatchActionResult,
} from '@/domain/batchActions'
import { noCapabilities } from '@/domain/capabilities'
import { runTorrentBatch } from '@/services/batchActions'
import {
  deleteTorrents,
  setTorrentsRunning,
  type TorrentHashes,
} from '@/services/torrents'
import {
  batchActionFeedbackAtom,
  batchActionPendingAtom,
  connectionInfoAtom,
  torsTableAtom,
} from '@/store'

export const useTorrentActions = () => {
  const connectionInfo = useAtomValue(connectionInfoAtom)
  const table = useAtomValue(torsTableAtom)
  const capabilities = connectionInfo?.capabilities ?? noCapabilities
  const setFeedback = useSetAtom(batchActionFeedbackAtom)
  const setPending = useSetAtom(batchActionPendingAtom)

  const setRunning = (hashes: TorrentHashes, running: boolean) =>
    setTorrentsRunning(hashes, running, capabilities)

  const getSelectedHashes = () =>
    table?.getSelectedRowModel().rows.map((row) => row.original.hash) ?? []

  const getSelectedTorrents = () =>
    table?.getSelectedRowModel().rows.map((row) => row.original) ?? []

  const runSelected = async (
    action: string,
    operation: (hashes: string[]) => Promise<BatchActionResult>,
  ) => {
    const hashes = getSelectedHashes()
    if (!hashes.length) return { succeeded: [], failed: [] }
    setPending(true)
    setFeedback(null)
    try {
      const result = await operation(hashes)
      const feedback: BatchActionFeedback = { action, ...result }
      setFeedback(feedback)
      return result
    } finally {
      setPending(false)
    }
  }

  const setSelectedRunning = (running: boolean) =>
    runSelected(running ? 'Start' : 'Stop', (hashes) =>
      runTorrentBatch(hashes, (hash) => setRunning([hash], running)),
    )

  const deleteSelected = async (deleteFiles: boolean) => {
    const result = await runSelected('Delete', (hashes) =>
      runTorrentBatch(hashes, (hash) => deleteTorrents([hash], deleteFiles)),
    )
    const failed = new Set(result.failed.map(({ hash }) => hash))
    table?.setRowSelection(
      Object.fromEntries(
        table
          .getRowModel()
          .rows.filter((row) => failed.has(row.original.hash))
          .map((row) => [row.id, true]),
      ),
    )
    return result
  }

  return {
    capabilities,
    deleteSelected,
    getSelectedHashes,
    getSelectedTorrents,
    runSelected,
    setRunning,
    setSelectedRunning,
  }
}
