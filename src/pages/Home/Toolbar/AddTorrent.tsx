import { Button } from '@/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/Dialog'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import { Tabs, TabsList, TabsTrigger } from '@/ui/Tabs'
import { PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function FromLocalTab() {
  return <div>FromLocalTab</div>
}

function FromLinksTab() {
  return <div>FromLinksTab</div>
}

const tabs = [
  { name: 'fromLocal', content: <FromLocalTab /> },
  { name: 'fromLinks', content: <FromLinksTab /> },
]

export function AddTorrent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <PlusCircleIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Torrents</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs className={cn('flex flex-col bg-pink-50')}>
            <TabsList className="flex justify-between">
              <div>
                {tabs.map(({ name }) => (
                  <TabsTrigger key={name} value={name}>
                    {name}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
