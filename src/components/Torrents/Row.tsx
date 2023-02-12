import { flexRender, Row } from '@tanstack/react-table'
import { Torrent } from '@/types'
import { useAtom } from 'jotai'
import { currentTorHashAtom } from './atoms'
import { cn } from '@/utils'

const Row = ({ row }: { row: Row<Torrent> }) => {
  const hash = row.original.hash
  const [currTorHash, setCurrTorHash] = useAtom(currentTorHashAtom)

  return (
    <div
      className={cn(
        'flex hover:bg-yellow-100',
        currTorHash && currTorHash === hash && 'bg-yellow-200'
      )}
      onClick={() => setCurrTorHash(hash)}
    >
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
