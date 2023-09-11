import { DndContext, useDraggable } from '@dnd-kit/core'
import { useSetAtom } from 'jotai'
import { MIN_SIDEBAR_WIDTH } from '@/lib/constants'
import { getRound } from '@/lib/utils'
import { sidebarWidthAtom } from './atoms'

function Resizer() {
  const {
    setNodeRef: dragRef,
    transform,
    attributes,
    listeners,
  } = useDraggable({ id: 'sidebar-resizer' })

  return (
    <div
      className="group h-full px-[1px] hover:cursor-col-resize hover:bg-primary/50"
      ref={dragRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div className="h-full w-[1px] bg-border group-hover:bg-inherit"></div>
    </div>
  )
}

export default function SidebarResizer() {
  const setSidebarWidth = useSetAtom(sidebarWidthAtom)

  return (
    <DndContext
      onDragEnd={(e) => {
        setSidebarWidth((prev) => {
          const x = prev + getRound(e.delta.x)
          return x < MIN_SIDEBAR_WIDTH ? MIN_SIDEBAR_WIDTH : x
        })
      }}
    >
      <Resizer />
    </DndContext>
  )
}
