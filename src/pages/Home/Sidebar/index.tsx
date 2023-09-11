import { useDraggable } from '@dnd-kit/core'
import { useAtom } from 'jotai'
import { ScrollArea } from '@/ui/ScrollArea'
import { sidebarWidthAtom } from './atoms'
import Categories from './Categories'
import Status from './Status'
import Tags from './Tags'
import Trackers from './Trackers'

const Sidebar = () => {
  const [width] = useAtom(sidebarWidthAtom)

  const {
    setNodeRef: dragRef,
    transform,
    attributes,
    listeners,
  } = useDraggable({ id: 'sidebar resizer' })

  return (
    <div className="relative flex flex-none" style={{ width: width + 'px' }}>
      <ScrollArea className="h-full px-1">
        {/* <div className={'flex h-full w-full flex-col gap-2 p-4'}> */}
        <Status />
        <Categories />
        <Tags />
        <Trackers />
        {/* </div> */}
      </ScrollArea>

      <div
        className="absolute right-0 h-full w-1 bg-border hover:cursor-col-resize hover:bg-primary/50"
        ref={dragRef}
        {...attributes}
        {...listeners}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        }}
      ></div>
    </div>
  )
}

export default Sidebar
