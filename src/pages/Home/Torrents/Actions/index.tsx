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
} from 'lucide-react'

function TorrentsActions() {
  return (
    <div className="flex h-10 items-center px-2">
      <Button variant="ghost" size="sm">
        <Play />
      </Button>

      <Button variant="ghost" size="sm">
        <Pause />
      </Button>

      <DeleteTorrent />

      <Button variant="ghost" size="sm">
        <Wrench />
      </Button>

      <Button variant="ghost" size="sm">
        <FastForward />
      </Button>

      <Button variant="ghost" size="sm">
        <CheckCheck />
      </Button>

      <Button variant="ghost" size="sm">
        <SatelliteDish />
      </Button>
    </div>
  )
}

export default TorrentsActions
