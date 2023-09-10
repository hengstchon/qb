import { ClipboardCopy } from 'lucide-react'
import { Button } from '@/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu'

export default function Copy() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <ClipboardCopy className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Copy</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Name</DropdownMenuItem>
        <DropdownMenuItem>Hash</DropdownMenuItem>
        <DropdownMenuItem>Magnet Link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
