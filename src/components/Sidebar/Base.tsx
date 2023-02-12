import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'
import { ChevronDownIcon } from 'lucide-react'

const Item = ({ children }: { children: JSX.Element[] }) => {
  return (
    <li>
      <button className="flex w-full justify-between rounded px-2 py-[2px] hover:bg-green-100">
        {children}
      </button>
    </li>
  )
}

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
  <div className="bg-green-50">
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-1 rounded border px-2">
        <span>{title}</span>
        <ChevronDownIcon className="h-5 w-5 transform duration-300 ease-in-out group-data-[state=closed]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="flex flex-col p-2 text-sm">
          {itemList.map((item) => (
            <Item key={item}>
              <span className="truncate">{item}</span>
              <span>({getNum(item)})</span>
            </Item>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  </div>
)
