import { Button } from '@/ui/Button'
import {
  ClipboardCopyIcon,
  FileEditIcon,
  FilePlus2Icon,
  Trash2Icon,
} from 'lucide-react'

const Actions = () => {
  return (
    <div className="flex">
      <Button variant="ghost" size="sm">
        <FilePlus2Icon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="sm">
        <FileEditIcon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="sm">
        <Trash2Icon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="sm">
        <ClipboardCopyIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default Actions
