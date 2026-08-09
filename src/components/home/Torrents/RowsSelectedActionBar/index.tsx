import { useAtomValue } from 'jotai'
import {
  CheckCheck,
  FastForward,
  Pause,
  Play,
  SatelliteDish,
} from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import {
  reannounceTorrents,
  recheckTorrents,
  setTorrentBoolean,
} from '@/services'
import { batchActionPendingAtom } from '@/store'
import { Button } from '@/ui/Button'
import { Separator } from '@/ui/Separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/Tooltip'
import BatchActionFeedback from './BatchActionFeedback'
import Copy from './Copy'
import DeleteTorrent from './DeleteTorrent'
import SetCategory from './SetCategory'
import SetLimits from './SetLimits'
import SetLocation from './SetLocation'
import SetOthers from './SetOthers'
import SetTags from './SetTags'

function TorrentsActions() {
  const { runSelected, setSelectedRunning, getSelectedTorrents, capabilities } =
    useTorrentActions()
  const pending = useAtomValue(batchActionPendingAtom)
  const selectedCount = getSelectedTorrents().length

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex h-8 items-center rounded-md border px-2">
        <span className="text-muted-foreground mr-2 text-xs">
          {selectedCount} selected
        </span>
        <TooltipProvider delayDuration={300}>
          {/* resume */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Start selected torrents"
                disabled={pending || selectedCount === 0}
                variant="ghost"
                size="sm"
                onClick={() => void setSelectedRunning(true)}
              >
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start Torrents</TooltipContent>
          </Tooltip>

          {/* pause */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Stop selected torrents"
                disabled={pending || selectedCount === 0}
                variant="ghost"
                size="sm"
                onClick={() => void setSelectedRunning(false)}
              >
                <Pause className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop Torrents</TooltipContent>
          </Tooltip>

          <DeleteTorrent />

          {/* force resume */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Force start selected torrents"
                variant="ghost"
                size="sm"
                disabled={pending || selectedCount === 0}
                onClick={() =>
                  void runSelected('Force start', (hashes) =>
                    setTorrentBoolean(hashes, 'forceStart', true),
                  )
                }
              >
                <FastForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Force Resume</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" />

          <SetLocation />

          <SetCategory />

          <SetTags />

          <SetLimits />

          <Separator orientation="vertical" />

          {/* force recheck */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Recheck selected torrents"
                variant="ghost"
                size="sm"
                disabled={pending || selectedCount === 0}
                onClick={() =>
                  void runSelected('Recheck', (hashes) =>
                    recheckTorrents(hashes),
                  )
                }
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Force Recheck</TooltipContent>
          </Tooltip>

          {/* force reannounce */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Reannounce selected torrents"
                variant="ghost"
                size="sm"
                disabled={pending || selectedCount === 0}
                onClick={() =>
                  void runSelected('Reannounce', (hashes) =>
                    reannounceTorrents(hashes, [], capabilities),
                  )
                }
              >
                <SatelliteDish className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Force Reannounce</TooltipContent>
          </Tooltip>

          <SetOthers />

          <Copy />
        </TooltipProvider>
      </div>
      <BatchActionFeedback />
    </div>
  )
}

export default TorrentsActions
