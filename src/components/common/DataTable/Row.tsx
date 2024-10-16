import { flexRender, Row } from '@tanstack/react-table'
import { PrimitiveAtom, useAtom } from 'jotai'
import { cn } from '@/utils'

const Row = <T,>({
  row,
  currRowAtom,
}: {
  row: Row<T>
  currRowAtom: PrimitiveAtom<number>
}) => {
  const [currRow, setCurrRow] = useAtom(currRowAtom)

  return (
    <div
      className={cn(
        'flex h-6 hover:bg-yellow-100',
        currRow === row.index && 'bg-yellow-200'
      )}
      onClick={() => setCurrRow(row.index)}
    >
      {row.getVisibleCells().map((cell) => {
        const className = cell.column.columnDef.meta?.className
        const isFirstCol = cell.column.id === 'select'
        return (
          <div
            key={cell.id}
            className={cn(
              'flex items-center justify-center border border-dotted px-1',
              className
            )}
            style={isFirstCol ? undefined : { width: cell.column.getSize() }}
          >
            {isFirstCol ? (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            ) : (
              <div className="flex items-center truncate text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Row
