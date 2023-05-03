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

function TorrentsActions() {
  return (
    <div className="flex h-8 items-center px-2">
      {/* resume */}
      <Button variant="ghost" size="sm">
        <Play className="h-4 w-4" />
      </Button>

      {/* pause */}
      <Button variant="ghost" size="sm">
        <Pause className="h-4 w-4" />
      </Button>

      {/* delete */}
      <DeleteTorrent />

      {/* force resume */}
      <Button variant="ghost" size="sm">
        <FastForward className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" />

      {/* set location */}
      <Button variant="ghost" size="sm">
        <MapPin className="h-4 w-4" />
      </Button>

      {/* set category */}
      <Button variant="ghost" size="sm">
        <LayoutList className="h-4 w-4" />
      </Button>

      {/* set tags */}
      <Button variant="ghost" size="sm">
        <TagsIcon className="h-4 w-4" />
      </Button>

      {/* limit upload, download, share ratio */}
      <Button variant="ghost" size="sm">
        <Gauge className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" />

      {/* force recheck */}
      <Button variant="ghost" size="sm">
        <CheckCheck className="h-4 w-4" />
      </Button>

      {/* force reannounce */}
      <Button variant="ghost" size="sm">
        <SatelliteDish className="h-4 w-4" />
      </Button>

      {/* autoTMM, super seeding mode, */}
      {/* download in sequential order, */}
      {/* download first and last pieces first */}
      <Button variant="ghost" size="sm">
        <Wrench className="h-4 w-4" />
      </Button>

      {/* copy name, hash, magnet link */}
      <Button variant="ghost" size="sm">
        <ClipboardCopy className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default TorrentsActions
