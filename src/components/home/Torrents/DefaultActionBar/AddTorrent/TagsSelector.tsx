import { Dispatch, SetStateAction } from 'react'
import { produce } from 'immer'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/Command'
import { Label } from '@/ui/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover'
import { cn } from '@/utils'

type TagsSelectorProps = {
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
  allTags: string[]
}
function TagsSelector({ tags, setTags, allTags }: TagsSelectorProps) {
  return (
    <>
      <Label htmlFor="tags-input" className="text-right font-normal">
        Tags
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="tags-input"
            variant="outline"
            size="sm"
            role="combobox"
            aria-label="Select tags..."
            className="col-span-2 h-auto min-h-[32px] flex-1 justify-between py-1 font-normal text-muted-foreground"
          >
            {tags.length ? (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              'Select tags...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 sm:w-[340px]">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              {allTags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => {
                    if (tags.includes(tag)) {
                      setTags(
                        produce(tags, (draft) => {
                          return draft.filter((t) => t !== tag)
                        }),
                      )
                    } else {
                      setTags(
                        produce(tags, (draft) => {
                          draft.push(tag)
                        }),
                      )
                    }
                  }}
                >
                  {tag}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      tags.includes(tag) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default TagsSelector
