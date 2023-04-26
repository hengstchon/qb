import useSWR from 'swr'
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
import { ChevronRightIcon, PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/ui/Textarea'
import { RadioGroup, RadioGroupItem } from '@/ui/RadioGroup'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'
import { API } from '@/api/endpoints'
import { Category } from '@/lib/types'
import { Checkbox } from '@/ui/Checkbox'
import { Switch } from '@/ui/Switch'

function FromLocalTab() {
  return (
    <div className="w-full py-4">
      <Input id="torrents" type="file" className="h-10" multiple />
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
  const { data: categories } = useSWR<Record<string, Category>>(
    API.torrents.categories
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <PlusCircleIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
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

          {/* Options */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center space-x-2 rounded px-2">
              <ChevronRightIcon className="h-5 w-5 transform duration-100 ease-in-out group-data-[state=open]:rotate-90" />
              <span>Options</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              {/* Mode */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="mode" className="text-right">
                  Mode
                </Label>
                <RadioGroup
                  defaultValue="manual"
                  id="mode"
                  className="col-span-2 flex gap-12"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Manual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto">Automatic</Label>
                  </div>
                </RadioGroup>
                {/* Save location */}
                <Label htmlFor="save-location" className="text-right">
                  Save location
                </Label>
                <Input id="save-location" className="col-span-2" />
                {/* Rename torrent */}
                <Label htmlFor="rename-torrent" className="text-right">
                  Rename torrent
                </Label>
                <Input id="rename-torrent" className="col-span-2" />
                {/* Category */}
                <Select onValueChange={(value) => {}}>
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <SelectTrigger className="col-span-2 h-8 w-32" id="category">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  {categories && (
                    <SelectContent>
                      {Object.values(categories).map(({ name }) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="start-torrent" />
                  <Label htmlFor="start-torrent">Start torrent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skip-check" />
                  <Label htmlFor="skip-check">Skip hash check</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sequential-download" />
                  <Label htmlFor="sequential-download">
                    Download in sequential order
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="first-last-piece" />
                  <Label htmlFor="first-last-piece">
                    Download first and last pieces first
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="create-subfolder" />
                  <Label htmlFor="create-subfolder">Create subfolder</Label>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 items-center gap-4">
                <Label htmlFor="download-limit" className="text-right">
                  Limit download rate
                </Label>
                <Input id="download-limit" className="col-span-2" />
                <Label htmlFor="upload-limit" className="text-right">
                  Limit upload rate
                </Label>
                <Input id="upload-limit" className="col-span-2" />
              </div>

              <div className="mt-8 flex items-center justify-end space-x-2">
                <Switch id="remember" />
                <Label htmlFor="remember">Remember options</Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter>
          <Button type="submit">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
