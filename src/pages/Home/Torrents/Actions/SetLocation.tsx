import { MapPin } from 'lucide-react'
import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'

export default function SetLocation() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <MapPin className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Label htmlFor="set-location">Location:</Label>
        <Input id="set-location" className="mt-1" />
        <Button variant="secondary" size="sm" className="mt-2">
          Confirm
        </Button>
      </PopoverContent>
    </Popover>
  )
}
