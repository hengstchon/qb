import { Button } from '@/ui/Button'
import DeleteTorrent from './DeleteTorrent'
import {
  CheckCheck,
  CheckCircle,
  FastForward,
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
  Settings2,
  Wrench,
  SatelliteDish,
  ClipboardCopy,
  MapPin,
  Gauge,
  LayoutList,
  TagsIcon,
} from 'lucide-react'
import { Separator } from '@/ui/Separator'
import SetLocation from './SetLocation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/Tooltip'
import SetCategory from './SetCategory'
import SetTags from './SetTags'
import SetLimits from './SetLimits'
import SetOthers from './SetOthers'
import Copy from './Copy'

function TorrentsActions() {
  return (
    <div className="flex h-8 items-center border px-2">
      <TooltipProvider delayDuration={300}>
        {/* resume */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Resume Torrents</TooltipContent>
        </Tooltip>

        {/* pause */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Pause className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pause Torrents</TooltipContent>
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
