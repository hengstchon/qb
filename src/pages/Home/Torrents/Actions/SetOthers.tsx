import { Button } from '@/ui/Button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu'
import { Wrench } from 'lucide-react'

export default function SetOthers() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Wrench className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Set Others</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>AutoTMM</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Download in sequential order
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Download first and last pieces first
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
