import { SetStateAction } from 'react'
import { ColumnOrderState, flexRender, Header } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, GripVerticalIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useAtom, WritableAtom } from 'jotai'

const HeaderColumn = <T,>({
  header,
  colOrderAtom,
}: {
  header: Header<T, unknown>
  colOrderAtom: WritableAtom<
    ColumnOrderState,
    [arg: SetStateAction<ColumnOrderState>],
    void
  >
}) => {
  const isFirstCol = header.id === 'select'

  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: header.id,
  })

  const {
    isOver,
    setNodeRef: dropRef,
    active,
    over,
  } = useDroppable({
    id: header.id,
  })

  const [columnOrder] = useAtom(colOrderAtom)
  const activeIndex = columnOrder.indexOf(active?.id as string)
  const overIndex = over?.id ? columnOrder.indexOf(over?.id as string) : -1

  return isFirstCol ? (
    <div className="flex items-center border border-dotted px-1">
      {flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  ) : (
    <div
      ref={dropRef}
      className={cn(
        'th group relative border border-dotted',
        isDragging && 'opacity-50',
        !isDragging &&
          isOver &&
          (overIndex > activeIndex
            ? 'after:absolute after:top-0 after:right-0 after:z-10 after:-mr-[3px] after:block after:h-full after:w-1 after:bg-red-500'
            : 'before:absolute before:-ml-[3px] before:block before:h-full before:w-1 before:bg-red-500')
      )}
      style={{
        width: header.getSize(),
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div
        className={cn(
          'flex cursor-pointer select-none items-center gap-1 px-1 text-sm font-semibold',
          isOver ? 'cursor-move' : 'cursor-pointer'
        )}
        onClick={header.column.getToggleSortingHandler()}
      >
        <span className="truncate">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {{
          asc: <ArrowUpIcon className="h-4 w-4 flex-none" />,
          desc: <ArrowDownIcon className="h-4 w-4 flex-none" />,
        }[header.column.getIsSorted() as string] ?? null}
      </div>

      {/* drag handle & resizer */}
      <div
        className={cn(
          'absolute right-0 top-0 flex h-full opacity-0',
          !isOver && 'group-hover:opacity-100'
        )}
      >
        <div
          ref={dragRef}
          className={cn(
            'flex cursor-move items-center rounded hover:bg-gray-200'
          )}
          {...listeners}
          {...attributes}
        >
          <GripVerticalIcon className="h-4 w-4 text-gray-500" />
        </div>
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={cn(
              'w-[4px] cursor-col-resize touch-none select-none bg-gray-400',
              header.column.getIsResizing() && 'bg-blue-500'
            )}
          />
        )}
      </div>
    </div>
  )
}

export default HeaderColumn
