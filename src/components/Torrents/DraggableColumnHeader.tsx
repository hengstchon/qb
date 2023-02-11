import { FC } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import {
  flexRender,
  Column,
  ColumnOrderState,
  Header,
  Table,
} from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Torrent } from '@/types'
import { cn } from '@/utils'
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core'

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

const DraggableColumnHeader: FC<{
  header: Header<Torrent, unknown>
  table: Table<Torrent>
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table
  let { columnOrder } = getState()
  const { column } = header

  // const [{ isDragging }, dragRef, previewRef] = useDrag({
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  //   item: () => column,
  //   type: 'column',
  // })
  //
  // const [, dropRef] = useDrop({
  //   accept: 'column',
  //   drop: (draggedColumn: Column<Torrent>) => {
  //     if (!columnOrder.length) {
  //       columnOrder = table.getAllColumns().map((c) => c.id)
  //     }
  //     const newColumnOrder = reorderColumn(
  //       draggedColumn.id,
  //       column.id,
  //       columnOrder
  //     )
  //     setColumnOrder(newColumnOrder)
  //   },
  // })

  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: header.id,
  })

  const { isOver, setNodeRef: dropRef } = useDroppable({
    id: header.id,
  })
  const dndContext = useDndContext()

  return (
    <div
      key={header.id}
      ref={dropRef}
      className="th group relative border border-dotted"
      style={{
        width: header.getSize(),
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? 'purple' : undefined,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div
        className={cn(
          'flex select-none items-center gap-1 px-1 text-sm font-semibold',
          isDragging ? 'cursor-move' : 'cursor-pointer'
        )}
        onClick={header.column.getToggleSortingHandler()}
        ref={dragRef}
        {...listeners}
        {...attributes}
      >
        <span className="truncate">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {{
          asc: <ArrowUpIcon className="h-4 w-4 flex-none" />,
          desc: <ArrowDownIcon className="h-4 w-4 flex-none" />,
        }[header.column.getIsSorted() as string] ?? null}
      </div>
      {header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            'absolute right-0 top-0 h-full w-[5px] cursor-col-resize touch-none select-none bg-black bg-opacity-50 opacity-0 group-hover:opacity-100',
            header.column.getIsResizing() ? 'bg-blue-500 opacity-100' : ''
          )}
        />
      )}
    </div>
  )
}

export default DraggableColumnHeader
