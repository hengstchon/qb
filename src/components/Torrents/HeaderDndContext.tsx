import { DndContext, DragEndEvent, pointerWithin } from '@dnd-kit/core'
import { ColumnOrderState } from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { torsColOrderAtom } from './atoms'

const HeaderDndContext = ({ children }: { children: JSX.Element }) => {
  const [columnOrder, setColumnOrder] = useAtom(torsColOrderAtom)

  const reorderColumn = (
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[]
  ): ColumnOrderState => {
    columnOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
    )
    return [...columnOrder]
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeId = active.id
    const overId = over?.id
    if (!overId || activeId === overId) return

    setColumnOrder(
      reorderColumn(
        activeId as string,
        overId as string,
        columnOrder as string[]
      )
    )
  }

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  )
}

export default HeaderDndContext
