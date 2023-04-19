import { useDraggable } from '@dnd-kit/core'
import { useAtom } from 'jotai'
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
      <div
        className={
          'flex h-full w-full flex-col gap-2 overflow-y-auto bg-blue-50 p-4'
        }
      >
        <Status />
        <Categories />
        <Tags />
        <Trackers />
      </div>

      <div
        className="absolute right-0 h-full w-1 bg-gray-100 hover:cursor-col-resize hover:bg-gray-500"
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
