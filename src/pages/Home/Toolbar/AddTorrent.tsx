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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs'
import { PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/ui/Textarea'

function FromLocalTab() {
  return (
    <div className="w-full py-4">
      <Input id="torrents" type="file" multiple />
    </div>
  )
}

function FromLinksTab() {
  return (
    <div className="grid gap-4 py-4">
      <span className="text-sm">
        Download Torrents from their URLs or Magnet links:
      </span>
      <Textarea placeholder="Input your torrent links..." />
    </div>
  )
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
          <Tabs
            className={cn('flex flex-col bg-pink-50')}
            defaultValue={tabs[0].name}
          >
            <TabsList className="flex justify-between">
              <div>
                {tabs.map(({ name }) => (
                  <TabsTrigger key={name} value={name}>
                    {name}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
            {tabs.map(({ name, content }) => (
              <TabsContent
                key={name}
                value={name}
                className="flex-1 overflow-auto px-2"
              >
                {content}
              </TabsContent>
            ))}
          </Tabs>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
