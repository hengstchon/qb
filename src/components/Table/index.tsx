import { ColumnOrderState, Table } from '@tanstack/react-table'
import { PrimitiveAtom, WritableAtom } from 'jotai'
import { SetStateAction } from 'react'
import HeaderColumn from './HeaderColumn'
import HeaderContextMenu from './HeaderContextMenu'
import HeaderDndContext from './HeaderDndContext'
import Row from './Row'
import { selectColumnDef } from './selectColumn'

const BaseTable = <T,>({
  table,
  colOrderAtom,
  currRowAtom,
}: {
  table: Table<T>
  colOrderAtom: WritableAtom<
    ColumnOrderState,
    [arg: SetStateAction<ColumnOrderState>],
    void
  >
  currRowAtom: PrimitiveAtom<number>
}) => {
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

      {/* rows */}
      {table.getRowModel().rows.map((row) => (
        <Row<T> key={row.id} row={row} currRowAtom={currRowAtom} />
      ))}
    </div>
  )
}

export default BaseTable
export { selectColumnDef }
