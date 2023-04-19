import { ColumnOrderState, Table } from '@tanstack/react-table'
import { PrimitiveAtom, WritableAtom } from 'jotai'
import React, { SetStateAction } from 'react'
import HeaderColumn from './HeaderColumn'
import HeaderContextMenu from './HeaderContextMenu'
import HeaderDndContext from './HeaderDndContext'
import Row from './Row'
import { selectColumnDef } from './selectColumn'
import { useVirtualizer } from '@tanstack/react-virtual'

const BaseTable = <T,>({
  table,
  colOrderAtom,
  currRowAtom,
  virtualize,
}: {
  table: Table<T>
  colOrderAtom: WritableAtom<
    ColumnOrderState,
    [arg: SetStateAction<ColumnOrderState>],
    void
  >
  currRowAtom: PrimitiveAtom<number>
  virtualize?: boolean
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 5,
    debug: true,
  })
  console.log('size:', rowVirtualizer.getVirtualItems())

  return (
    <div className="table border border-dotted">
      {/* header */}
      <HeaderContextMenu<T> table={table}>
        <HeaderDndContext colOrderAtom={colOrderAtom}>
          <div className="relative flex">
            {table.getLeafHeaders().map((header) => (
              <HeaderColumn<T>
                key={header.id}
                header={header}
                colOrderAtom={colOrderAtom}
              />
            ))}
          </div>
        </HeaderDndContext>
      </HeaderContextMenu>

      {virtualize ? (
        <div
          ref={parentRef}
          style={{
            height: `200px`,
            width: `700px`,
            overflow: 'auto', // Make it scroll!
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {/* xxx {virtualItem.index} */}
                  <Row<T>
                    key={virtualItem.index}
                    row={rows[virtualItem.index]}
                    currRowAtom={currRowAtom}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        table
          .getRowModel()
          .rows.map((row) => (
            <Row<T> key={row.id} row={row} currRowAtom={currRowAtom} />
          ))
      )}
    </div>
  )
}

export default BaseTable
export { selectColumnDef }
