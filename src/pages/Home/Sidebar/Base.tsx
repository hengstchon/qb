import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/ui/Button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'

type Props = {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  itemList: string[]
  getNum: (item: string) => number
}

export const BaseCollapsible = ({
  title,
  open,
  setOpen,
  itemList,
  getNum,
}: Props) => (
  <Collapsible open={open} onOpenChange={setOpen}>
    <CollapsibleTrigger className="group flex w-full items-center justify-between gap-1 px-4 py-2">
      <h2 className="font-semibold">{title}</h2>
      <ChevronDownIcon className="h-5 w-5 transform duration-300 ease-in-out group-data-[state=closed]:rotate-90" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      {itemList.map((item) => (
        <Button
          key={item}
          variant="ghost"
          className="flex h-8 w-full justify-between font-normal"
        >
          <span className="truncate">{item}</span>
          <span>({getNum(item)})</span>
        </Button>
      ))}
    </CollapsibleContent>
  </Collapsible>
)
