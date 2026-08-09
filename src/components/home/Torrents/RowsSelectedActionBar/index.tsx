import {
  CheckCheck,
  FastForward,
  Pause,
  Play,
  SatelliteDish,
} from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import { Button } from '@/ui/Button'
import { Separator } from '@/ui/Separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/Tooltip'
import Copy from './Copy'
import DeleteTorrent from './DeleteTorrent'
import SetCategory from './SetCategory'
import SetLimits from './SetLimits'
import SetLocation from './SetLocation'
import SetOthers from './SetOthers'
import SetTags from './SetTags'

function TorrentsActions() {
  const { setSelectedRunning } = useTorrentActions()

  return (
    <div className="flex h-8 items-center rounded-md border px-2">
      <TooltipProvider delayDuration={300}>
        {/* resume */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
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
            <Button variant="ghost" size="sm">
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
            <Button variant="ghost" size="sm">
              <CheckCheck className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Force Recheck</TooltipContent>
        </Tooltip>

        {/* force reannounce */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <SatelliteDish className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Force Reannounce</TooltipContent>
        </Tooltip>

        <SetOthers />

        <Copy />
      </TooltipProvider>
    </div>
  )
}

export default TorrentsActions
