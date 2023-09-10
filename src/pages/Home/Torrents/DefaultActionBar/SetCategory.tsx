import { LayoutList } from 'lucide-react'
import { Button } from '@/ui/Button'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'

export default function SetCategory() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <LayoutList className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Label htmlFor="set-category">Set Category:</Label>
        <Button variant="secondary" size="sm" className="mt-2">
          Confirm
        </Button>
      </PopoverContent>
    </Popover>
  )
}
