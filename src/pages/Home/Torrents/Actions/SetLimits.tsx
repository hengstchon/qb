import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'
import { Gauge } from 'lucide-react'

export default function SetLimits() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Gauge className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Label htmlFor="set-category">Set Limits:</Label>
        <div className="grid grid-cols-2 items-center gap-2">
          <Label>Upload rate:</Label>
          <Input />
          <Label>Download rate:</Label>
          <Input />
          <Label>Share ratio:</Label>
          <Input />
        </div>
        <Button variant="secondary" size="sm" className="mt-2">
          Confirm
        </Button>
      </PopoverContent>
    </Popover>
  )
}
