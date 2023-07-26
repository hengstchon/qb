import { SetStateAction } from 'react'
import { ColumnOrderState, flexRender, Header } from '@tanstack/react-table'
import { WritableAtom } from 'jotai'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const HeaderColumn = <T,>({
  header,
}: {
  header: Header<T, unknown>
  colOrderAtom: WritableAtom<
    ColumnOrderState,
    [arg: SetStateAction<ColumnOrderState>],
    void
  >
}) => {
  const isFirstCol = header.id === 'select'

  const className = header.column.columnDef.meta?.className

  return isFirstCol ? (
    <div className="flex items-center border border-dotted px-1">
      {flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  ) : (
    <div
      className={cn('th group relative border border-dotted')}
      style={{
        width: header.getSize(),
      }}
    >
      <div
        className={cn(
          'flex cursor-pointer select-none items-center justify-center gap-1 px-1 text-sm font-semibold',
          className,
        )}
        onClick={header.column.getToggleSortingHandler()}
      >
        <div className="flex items-center truncate">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
        {{
          asc: <ArrowUpIcon className="h-4 w-4 flex-none" />,
          desc: <ArrowDownIcon className="h-4 w-4 flex-none" />,
        }[header.column.getIsSorted() as string] ?? null}
      </div>

      {/* resizer */}
      <div
        className={cn(
          'absolute right-0 top-0 flex h-full opacity-0 group-hover:opacity-100',
        )}
      >
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={cn(
              'w-[4px] cursor-col-resize touch-none select-none bg-gray-400',
              header.column.getIsResizing() && 'bg-blue-500',
            )}
          />
        )}
      </div>
    </div>
  )
}

export default HeaderColumn
