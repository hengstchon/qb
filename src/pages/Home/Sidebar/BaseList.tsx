import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/Button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'

export function ListItem({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: JSX.Element[]
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-8 w-full justify-between font-normal',
        selected && 'bg-accent text-accent-foreground',
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

type Props = {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  children: JSX.Element[]
}

export function List({ title, open, setOpen, children }: Props) {
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-1 px-4 py-2">
        <h2 className="font-semibold">{title}</h2>
        <ChevronDownIcon className="h-5 w-5 transform duration-300 ease-in-out group-data-[state=closed]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}
