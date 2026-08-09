import type { Table } from '@tanstack/react-table'
import { useAtomValue } from 'jotai'
import { SatelliteDishIcon } from 'lucide-react'
import type { QbCapabilities } from '@/domain/capabilities'
import { useTorrentActions } from '@/hooks'
import { reannounceTorrents } from '@/services'
import { batchActionPendingAtom } from '@/store'
import type { Tracker } from '@/types'
import { Button } from '@/ui/Button'

export default function Actions({
  table,
  capabilities,
}: {
  table: Table<Tracker>
  capabilities: QbCapabilities
}) {
  const pending = useAtomValue(batchActionPendingAtom)
  const { runSelected } = useTorrentActions()
  if (!capabilities.supportsTrackerReannounce) return null

  const urls = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
    .filter((tracker) => tracker.tier >= 0)
    .map((tracker) => tracker.url)

  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label="Reannounce selected trackers"
        variant="ghost"
        size="sm"
        disabled={pending || urls.length === 0}
        onClick={() =>
          void runSelected('Reannounce tracker', (hashes) =>
            reannounceTorrents(hashes, urls, capabilities),
          )
        }
      >
        <SatelliteDishIcon className="mr-2 h-4 w-4" />
        Reannounce selected
      </Button>
      <span className="text-muted-foreground text-xs">
        {urls.length} tracker(s) selected
      </span>
    </div>
  )
}
