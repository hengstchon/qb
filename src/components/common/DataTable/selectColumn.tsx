import { createColumnHelper, type RowData } from '@tanstack/react-table'
import type { AppTableFeatures } from '@/config/table'
import { Checkbox } from '@/ui/Checkbox'

export const createSelectColumn = <TData extends RowData>() => {
  const ch = createColumnHelper<AppTableFeatures, TData>()
  return ch.display({
    id: 'select',
    enableSorting: false,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={
          table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            ? 'indeterminate'
            : table.getIsAllRowsSelected()
        }
        onCheckedChange={(e) => {
          table.toggleAllRowsSelected(e as boolean)
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select row ${row.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        disabled={!row.getCanSelect()}
      />
    ),
    size: 24,
  })
}
