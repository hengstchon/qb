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
import { AddTorrentPayload } from '@/lib/types'
import { Checkbox } from '@/ui/Checkbox'
import { Switch } from '@/ui/Switch'
import { Dispatch, useState } from 'react'
import { SetStateAction, useAtom } from 'jotai'
import client from '@/api/client'
import FormDataAddon from 'wretch/addons/formData'
import { tagsAtom } from '../atoms'
import { categoriesAtom } from '../atoms'

type FromLocalTabType = {
  setFiles: Dispatch<SetStateAction<File[]>>
}
function UploadTorrentsTab({ setFiles }: FromLocalTabType) {
  return (
    <div className="w-full py-4">
      <Input
        id="torrents"
        type="file"
        className="h-10"
        multiple
        accept=".torrent"
        onChange={(e) => {
          if (e.target.files) {
            setFiles([...e.target.files])
          }
        }}
      />
    </div>
  )
}

type FromLinksTabType = {
  urls: string
  setUrls: Dispatch<SetStateAction<string>>
  cookie: string
  setCookie: Dispatch<SetStateAction<string>>
}
function UploadLinksTab({
  urls,
  setUrls,
  cookie,
  setCookie,
}: FromLinksTabType) {
  return (
    <div className="grid gap-4 py-4">
      <span className="text-sm">
        Download Torrents from their URLs or Magnet links:
      </span>
      <Textarea
        placeholder="Input your torrent links..."
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <Label htmlFor="cookie">Cookie:</Label>
        <Input
          id="cookie"
          className=""
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
        />
      </div>
    </div>
  )
}

export function AddTorrent() {
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState('')
  const [savepath, setSavepath] = useState('')
  const [cookie, setCookie] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [skip_checking, setSkip_checking] = useState(false)
  const [startTorrent, setStartTorrent] = useState(false)
  const [root_folder, setRoot_folder] = useState(false)
  const [rename, setRename] = useState('')
  const [upLimit, setUpLimit] = useState(0)
  const [dlLimit, setDlLimit] = useState(0)
  const [autoTMM, setAutoTMM] = useState(false)
  const [sequentialDownload, setSequentialDownload] = useState(false)
  const [firstLastPiecePrio, setFirstLastPiecePrio] = useState(false)

  const [allCategories] = useAtom(categoriesAtom)
  console.log('all categories:', allCategories)
  const [allTags] = useAtom(tagsAtom)
  console.log('all tags:', allTags)

  const tabs = [
    {
      name: 'fromLocal',
      content: <UploadTorrentsTab setFiles={setFiles} />,
    },
    {
      name: 'fromLinks',
      content: (
        <UploadLinksTab
          urls={urls}
          setUrls={setUrls}
          cookie={cookie}
          setCookie={setCookie}
        />
      ),
    },
  ]

  function handleSubmit() {
    console.log('torrents:', files)
    console.log('urls:', urls)
    console.log('savepath:', savepath)
    console.log('cookie:', cookie)
    console.log('category:', category)
    console.log('tags:', tags)
    console.log('skip_checking:', skip_checking)
    console.log('startTorrent:', startTorrent)
    console.log('root_folder:', root_folder)
    console.log('rename:', rename)
    console.log('upLimit:', upLimit)
    console.log('dlLimit:', dlLimit)
    console.log('autoTMM:', autoTMM)
    console.log('sequentialDownload:', sequentialDownload)
    console.log('firstLastPiecePrio:', firstLastPiecePrio)
    const params: AddTorrentPayload = {
      torrents: files,
      urls,
      savepath,
      cookie,
      category,
      tags,
      skip_checking,
      paused: !startTorrent,
      root_folder,
      rename,
      upLimit,
      dlLimit,
      autoTMM,
      sequentialDownload,
      firstLastPiecePrio,
    }
    client
      .url(API.torrents.addTorrents)
      .addon(FormDataAddon)
      .formData(params)
      .post()
      .error(415, (e) => console.log('err:', e))
      .text((d) => console.log('response text:', d))
      .catch((e) => console.log('catch error:', e))
  }

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
          <Tabs className={cn('flex flex-col')} defaultValue={tabs[0].name}>
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
                  value={String(autoTMM)}
                  onValueChange={(value) => setAutoTMM(value === 'true')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="manual" />
                    <Label htmlFor="manual">Manual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="auto" />
                    <Label htmlFor="auto">Automatic</Label>
                  </div>
                </RadioGroup>
                {/* Save location */}
                <Label htmlFor="save-location" className="text-right">
                  Save location
                </Label>
                <Input
                  id="save-location"
                  className="col-span-2"
                  value={savepath}
                  onChange={(e) => setSavepath(e.target.value)}
                />
                {/* Rename torrent */}
                <Label htmlFor="rename-torrent" className="text-right">
                  Rename torrent
                </Label>
                <Input
                  id="ename-torrent"
                  className="col-span-2"
                  value={rename}
                  onChange={(e) => setRename(e.target.value)}
                />
                {/* Category */}
                <Select
                  onValueChange={(value) => {
                    setCategory(value)
                  }}
                >
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <SelectTrigger className="col-span-2 h-8 w-32" id="category">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  {allCategories && (
                    <SelectContent>
                      {Object.values(allCategories).map(({ name }) => (
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
                  <Checkbox
                    id="start-torrent"
                    checked={startTorrent}
                    onCheckedChange={() => setStartTorrent((v) => !v)}
                  />
                  <Label htmlFor="start-torrent">Start torrent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skip-check"
                    checked={skip_checking}
                    onCheckedChange={() => setSkip_checking((v) => !v)}
                  />
                  <Label htmlFor="skip-check">Skip hash check</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sequential-download"
                    checked={sequentialDownload}
                    onCheckedChange={() => setSequentialDownload((v) => !v)}
                  />
                  <Label htmlFor="sequential-download">
                    Download in sequential order
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="first-last-piece"
                    checked={firstLastPiecePrio}
                    onCheckedChange={() => setFirstLastPiecePrio((v) => !v)}
                  />
                  <Label htmlFor="first-last-piece">
                    Download first and last pieces first
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="create-subfolder"
                    checked={root_folder}
                    onCheckedChange={() => setRoot_folder((v) => !v)}
                  />
                  <Label htmlFor="create-subfolder">Create subfolder</Label>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 items-center gap-4">
                <Label htmlFor="download-limit" className="text-right">
                  Limit download rate
                </Label>
                <Input
                  id="download-limit"
                  className="col-span-2"
                  type="number"
                  value={dlLimit}
                  onChange={(e) => setDlLimit(parseFloat(e.target.value))}
                />
                <Label htmlFor="upload-limit" className="text-right">
                  Limit upload rate
                </Label>
                <Input
                  id="upload-limit"
                  className="col-span-2"
                  type="number"
                  value={upLimit}
                  onChange={(e) => setUpLimit(parseFloat(e.target.value))}
                />
              </div>

              <div className="mt-8 flex items-center justify-end space-x-2">
                <Switch id="remember" />
                <Label htmlFor="remember">Remember options</Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
