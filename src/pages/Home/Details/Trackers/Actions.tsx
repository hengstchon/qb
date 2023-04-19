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
      <Button>
        <FilePlus2Icon className="h-5 w-5" />
      </Button>
      <Button>
        <FileEditIcon className="h-5 w-5" />
      </Button>
      <Button>
        <Trash2Icon className="h-5 w-5" />
      </Button>
      <Button>
        <ClipboardCopyIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default Actions
