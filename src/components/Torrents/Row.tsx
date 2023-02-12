import { flexRender, Row } from '@tanstack/react-table'
import { Torrent } from '@/types'

const Row = ({ row }: { row: Row<Torrent> }) => {
  return (
    <div className="flex">
      {row.getVisibleCells().map((cell) => {
        const isFirstCol = cell.column.id === 'select'
        return (
          <div
            key={cell.id}
            className="flex items-center border border-dotted px-1"
            style={isFirstCol ? undefined : { width: cell.column.getSize() }}
          >
            {isFirstCol ? (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            ) : (
              <span className="truncate text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Row
