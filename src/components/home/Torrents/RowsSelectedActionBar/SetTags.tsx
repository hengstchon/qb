import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { TagsIcon } from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import { updateTorrentTags } from '@/services'
import { batchActionPendingAtom, tagsAtom } from '@/store'
import { Button } from '@/ui/Button'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'
import TagsSelector from '../DefaultActionBar/AddTorrent/TagsSelector'

export default function SetTags() {
  const [operation, setOperation] = useState<'add' | 'remove' | 'clear'>('add')
  const [tags, setTags] = useState<string[]>([])
  const allTags = useAtomValue(tagsAtom)
  const pending = useAtomValue(batchActionPendingAtom)
  const { runSelected } = useTorrentActions()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button aria-label="Set torrent tags" variant="ghost" size="sm">
          <TagsIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-3">
        <Label htmlFor="tag-operation">Tag operation</Label>
        <Select
          value={operation}
          onValueChange={(value) =>
            setOperation(value as 'add' | 'remove' | 'clear')
          }
        >
          <SelectTrigger id="tag-operation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">Add selected tags</SelectItem>
            <SelectItem value="remove">Remove selected tags</SelectItem>
            <SelectItem value="clear">Remove all tags</SelectItem>
          </SelectContent>
        </Select>
        {operation !== 'clear' && (
          <div className="grid grid-cols-3 items-center gap-2">
            <TagsSelector tags={tags} setTags={setTags} allTags={allTags} />
          </div>
        )}
        <Button
          variant="secondary"
          size="sm"
          disabled={pending || (operation !== 'clear' && tags.length === 0)}
          onClick={() =>
            void runSelected('Update tags', (hashes) =>
              updateTorrentTags(hashes, operation, tags),
            )
          }
        >
          Apply tags
        </Button>
      </PopoverContent>
    </Popover>
  )
}
