import { Button } from '@/ui/Button'
import DeleteTorrent from './DeleteTorrent'
import FilterInput from './FilterInput'
import {
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
  Settings2,
  Wrench,
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

      <FilterInput />
    </div>
  )
}

export default TorrentsActions
