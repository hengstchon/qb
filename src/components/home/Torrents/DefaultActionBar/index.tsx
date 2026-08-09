import { useAtom } from 'jotai'
import { PauseCircleIcon, PlayCircleIcon, Settings2Icon } from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import { isHeaderEditingAtom } from '@/store'
import { Button } from '@/ui/Button'
import { AddTorrent } from './AddTorrent'

export default function RowActionBar({ rowNum }: { rowNum: number }) {
  const [isHeaderEditing, setIsHeaderEditing] = useAtom(isHeaderEditingAtom)
  const { setRunning } = useTorrentActions()

  return (
    <div className="flex h-8 items-center gap-4">
      <AddTorrent />
      <Button
        variant="outline"
        size="sm"
        onClick={() => void setRunning('all', true)}
      >
        <PlayCircleIcon className="mr-2 h-4 w-4" />
        Start All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => void setRunning('all', false)}
      >
        <PauseCircleIcon className="mr-2 h-4 w-4" />
        Stop All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsHeaderEditing(!isHeaderEditing)}
      >
        <Settings2Icon className="mr-2 h-4 w-4" />
        Adjust Headers
      </Button>
      <span className="ml-auto text-sm">{rowNum} Rows</span>
    </div>
  )
}
