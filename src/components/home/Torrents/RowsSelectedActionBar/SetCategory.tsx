import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { LayoutList } from 'lucide-react'
import { useTorrentActions } from '@/hooks'
import { setTorrentCategory } from '@/services'
import { batchActionPendingAtom, categoriesAtom } from '@/store'
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

export default function SetCategory() {
  const [category, setCategory] = useState('__none__')
  const categories = useAtomValue(categoriesAtom)
  const pending = useAtomValue(batchActionPendingAtom)
  const { runSelected } = useTorrentActions()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Set torrent category"
          variant="ghost"
          size="sm"
          disabled={pending}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Label htmlFor="set-category">Set category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="set-category" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Uncategorized</SelectItem>
            {Object.keys(categories).map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          disabled={pending}
          onClick={() =>
            void runSelected('Set category', (hashes) =>
              setTorrentCategory(
                hashes,
                category === '__none__' ? '' : category,
              ),
            )
          }
        >
          Apply category
        </Button>
      </PopoverContent>
    </Popover>
  )
}
