import { useAtom } from 'jotai'
import { PauseCircleIcon, PlayCircleIcon, Settings2Icon } from 'lucide-react'
import { Button } from '@/ui/Button'
import { isHeaderEditingAtom } from '../../atoms'
import { AddTorrent } from './AddTorrent'

export default function RowActionBar() {
  const [isHeaderEditing, setIsHeaderEditing] = useAtom(isHeaderEditingAtom)

  return (
    <div className="flex h-8 items-center gap-4">
      <AddTorrent />
      <Button variant="outline" size="sm">
        <PlayCircleIcon className="mr-2 h-4 w-4" />
        Resume All
      </Button>
      <Button variant="outline" size="sm">
        <PauseCircleIcon className="mr-2 h-4 w-4" />
        Pause All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsHeaderEditing(!isHeaderEditing)}
      >
        <Settings2Icon className="mr-2 h-4 w-4" />
        Adjust Headers
      </Button>
    </div>
  )
}
