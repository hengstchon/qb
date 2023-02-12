import { DndContext } from '@dnd-kit/core'
import { getRound, MIN_SIDEBAR_WIDTH } from '@/utils'
import { useSetAtom } from 'jotai'
import { sidebarWidthAtom } from './atoms'

const SidebarDndContext = ({ children }: { children: JSX.Element | false }) => {
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
      {children}
    </DndContext>
  )
}

export default SidebarDndContext
