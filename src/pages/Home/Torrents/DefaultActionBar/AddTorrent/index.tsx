import { Dispatch, useState } from 'react'
import { SetStateAction, useAtom } from 'jotai'
import { ChevronRightIcon, PlusCircleIcon } from 'lucide-react'
import FormDataAddon from 'wretch/addons/formData'
import client from '@/api/client'
import { API } from '@/api/endpoints'
import { AddTorrentPayload } from '@/lib/types'
import { cn } from '@/lib/utils'
import { categoriesAtom, tagsAtom } from '@/pages/Home/atoms'
import { Button } from '@/ui/Button'
import { Checkbox } from '@/ui/Checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'
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
import { RadioGroup, RadioGroupItem } from '@/ui/RadioGroup'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs'
import { Textarea } from '@/ui/Textarea'
import TagsSelector from './TagsSelector'

type FromLocalTabType = {
  setFiles: Dispatch<SetStateAction<File[]>>
}
function UploadLocalTab({ setFiles }: FromLocalTabType) {
  return (
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
    <>
      <span className="text-sm">
        Download Torrents from their URLs or Magnet links (only one link per
        line):
      </span>
      <Textarea
        placeholder="Input your torrent links..."
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <Label htmlFor="cookie" className="font-normal">
          Cookie:
        </Label>
        <Input
          id="cookie"
          className=""
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
        />
      </div>
    </>
  )
}

export function AddTorrent() {
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState('')
  const [savepath, setSavepath] = useState('')
  const [cookie, setCookie] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
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
  const [allTags] = useAtom(tagsAtom)

  const tabs = [
    {
      name: 'Local',
      content: <UploadLocalTab setFiles={setFiles} />,
    },
    {
      name: 'Links',
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
    // console.log('torrents:', files)
    // console.log('urls:', urls)
    // console.log('savepath:', savepath)
    // console.log('cookie:', cookie)
    // console.log('category:', category)
    // console.log('tags:', tags)
    // console.log('skip_checking:', skip_checking)
    // console.log('startTorrent:', startTorrent)
    // console.log('root_folder:', root_folder)
    // console.log('rename:', rename)
    // console.log('upLimit:', upLimit)
    // console.log('dlLimit:', dlLimit)
    // console.log('autoTMM:', autoTMM)
    // console.log('sequentialDownload:', sequentialDownload)
    // console.log('firstLastPiecePrio:', firstLastPiecePrio)
    const params: AddTorrentPayload = {
      torrents: files,
      urls,
      savepath,
      cookie,
      category,
      tags: tags.join(','),
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
        <Button variant="outline" size="sm">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Torrents
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Torrents</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 py-4">
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
                className="flex-1 space-y-4 overflow-auto px-4 py-2"
              >
                {content}
              </TabsContent>
            ))}
          </Tabs>

          {/* Options */}
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center space-x-2 rounded-md bg-muted p-2">
              <ChevronRightIcon className="h-5 w-5 transform rounded-full duration-100 ease-in-out group-data-[state=open]:rotate-90" />
              <span className="text-sm font-medium">Options</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-8 px-4 py-2">
              {/* Mode */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="mode" className="text-right font-normal">
                  Management Mode
                </Label>
                <RadioGroup
                  defaultValue="manual"
                  id="mode"
                  className="col-span-2 flex h-8 gap-12"
                  value={String(autoTMM)}
                  onValueChange={(value) => setAutoTMM(value === 'true')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="manual" />
                    <Label htmlFor="manual" className="font-normal">
                      Manual
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="auto" />
                    <Label htmlFor="auto" className="font-normal">
                      Automatic
                    </Label>
                  </div>
                </RadioGroup>
                {/* Save location */}
                <Label
                  htmlFor="save-location"
                  className="text-right font-normal"
                >
                  Save location
                </Label>
                <Input
                  id="save-location"
                  className="col-span-2"
                  value={savepath}
                  onChange={(e) => setSavepath(e.target.value)}
                />
                {/* Rename torrent */}
                <Label
                  htmlFor="rename-torrent"
                  className="text-right font-normal"
                >
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
                  <Label htmlFor="category" className="text-right font-normal">
                    Category
                  </Label>
                  <SelectTrigger className="col-span-2 h-8" id="category">
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
                {/* Tags */}
                <TagsSelector tags={tags} setTags={setTags} allTags={allTags} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="start-torrent"
                    checked={startTorrent}
                    onCheckedChange={() => setStartTorrent((v) => !v)}
                  />
                  <Label htmlFor="start-torrent" className="font-normal">
                    Start torrent
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skip-check"
                    checked={skip_checking}
                    onCheckedChange={() => setSkip_checking((v) => !v)}
                  />
                  <Label htmlFor="skip-check" className="font-normal">
                    Skip hash check
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sequential-download"
                    checked={sequentialDownload}
                    onCheckedChange={() => setSequentialDownload((v) => !v)}
                  />
                  <Label htmlFor="sequential-download" className="font-normal">
                    Download in sequential order
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="first-last-piece"
                    checked={firstLastPiecePrio}
                    onCheckedChange={() => setFirstLastPiecePrio((v) => !v)}
                  />
                  <Label htmlFor="first-last-piece" className="font-normal">
                    Download first and last pieces first
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="create-subfolder"
                    checked={root_folder}
                    onCheckedChange={() => setRoot_folder((v) => !v)}
                  />
                  <Label htmlFor="create-subfolder" className="font-normal">
                    Create subfolder
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label
                  htmlFor="download-limit"
                  className="text-right font-normal"
                >
                  Limit download rate
                </Label>
                <div className="col-span-2 flex items-center">
                  <Input
                    id="download-limit"
                    type="number"
                    value={dlLimit}
                    onChange={(e) => setDlLimit(parseFloat(e.target.value))}
                  />
                  <span className="pl-2 text-sm">B/s</span>
                </div>
                <Label
                  htmlFor="upload-limit"
                  className="text-right font-normal"
                >
                  Limit upload rate
                </Label>
                <div className="col-span-2 flex items-center">
                  <Input
                    id="upload-limit"
                    type="number"
                    value={upLimit}
                    onChange={(e) => setUpLimit(parseFloat(e.target.value))}
                  />
                  <span className="pl-2 text-sm">B/s</span>
                </div>
              </div>

              {/* <div className="flex items-center justify-end space-x-2"> */}
              {/*   <Switch id="remember" /> */}
              {/*   <Label htmlFor="remember">Remember options</Label> */}
              {/* </div> */}
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
