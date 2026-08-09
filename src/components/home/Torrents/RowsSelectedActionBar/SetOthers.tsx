import { useAtomValue } from 'jotai'
import { Wrench } from 'lucide-react'
import { torrentStatePredicates } from '@/domain/torrentState'
import { useTorrentActions } from '@/hooks'
import { setTorrentBoolean } from '@/services'
import { batchActionPendingAtom } from '@/store'
import type { Torrent } from '@/types'
import { Button } from '@/ui/Button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu'

const checkedState = (
  torrents: Torrent[],
  value: (torrent: Torrent) => boolean,
) => {
  const enabled = torrents.filter(value).length
  if (enabled === 0) return false
  if (enabled === torrents.length) return true
  return 'indeterminate' as const
}

export default function SetOthers() {
  const pending = useAtomValue(batchActionPendingAtom)
  const { getSelectedTorrents, runSelected } = useTorrentActions()
  const torrents = getSelectedTorrents()

  const setExplicit = (
    label: string,
    action: 'autoManagement' | 'superSeeding',
    enabled: boolean,
  ) =>
    runSelected(label, (hashes) => setTorrentBoolean(hashes, action, enabled))

  const setToggle = (
    label: string,
    action: 'sequentialDownload' | 'firstLastPiecePriority',
    enabled: boolean,
    current: (torrent: Torrent) => boolean,
  ) =>
    runSelected(label, () =>
      setTorrentBoolean(
        torrents
          .filter((torrent) => current(torrent) !== enabled)
          .map((torrent) => torrent.hash),
        action,
        enabled,
      ),
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Set other torrent options"
          variant="ghost"
          size="sm"
          disabled={pending}
        >
          <Wrench className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Set options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={checkedState(torrents, (torrent) => torrent.auto_tmm)}
          onCheckedChange={(enabled) =>
            void setExplicit(
              'Set automatic management',
              'autoManagement',
              enabled,
            )
          }
        >
          Automatic torrent management
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={checkedState(torrents, (torrent) => torrent.seq_dl)}
          onCheckedChange={(enabled) =>
            void setToggle(
              'Set sequential download',
              'sequentialDownload',
              enabled,
              (torrent) => torrent.seq_dl,
            )
          }
        >
          Download in sequential order
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={checkedState(torrents, (torrent) => torrent.f_l_piece_prio)}
          onCheckedChange={(enabled) =>
            void setToggle(
              'Set first and last piece priority',
              'firstLastPiecePriority',
              enabled,
              (torrent) => torrent.f_l_piece_prio,
            )
          }
        >
          Download first and last pieces first
        </DropdownMenuCheckboxItem>
        {torrents.length > 0 &&
          torrents.every((torrent) =>
            torrentStatePredicates.seeding(torrent),
          ) && (
            <DropdownMenuCheckboxItem
              checked={checkedState(
                torrents,
                (torrent) => torrent.super_seeding,
              )}
              onCheckedChange={(enabled) =>
                void setExplicit('Set super seeding', 'superSeeding', enabled)
              }
            >
              Super seeding
            </DropdownMenuCheckboxItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
