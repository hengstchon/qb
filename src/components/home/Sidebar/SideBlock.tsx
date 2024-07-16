import { ChevronRightIcon } from 'lucide-react'
import { Button } from '@/ui/Button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'
import { cn } from '@/utils'

type SideBlockItemProps = {
  selected?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}

export function SideBlockItem({
  selected,
  onClick,
  children,
}: SideBlockItemProps) {
  return (
    <Button
      variant={selected ? 'secondary' : 'ghost'}
      size="sm"
      className={cn('h-8 w-full justify-between font-normal')}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

type SideBlockProps = {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}

export const SideBlock = ({
  title,
  open,
  setOpen,
  children,
}: SideBlockProps) => {
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="p-2">
      <CollapsibleTrigger className="group inline-flex w-full items-center px-3 py-2">
        <ChevronRightIcon className="mr-2 h-4 w-4 transform duration-300 ease-in-out group-data-[state=open]:rotate-90" />
        <span className="text-sm font-semibold">{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}
