import { createColumnHelper } from '@tanstack/react-table'
import { Checkbox } from '@/ui/Checkbox'

const ch = createColumnHelper()

export const selectColumnDef = ch.display({
  id: 'select',
  enableSorting: false,
  enableResizing: false,
  header: ({ table }) => (
    <Checkbox
      aria-label="Select all rows"
      checked={
        table.getIsSomeRowsSelected()
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
      onCheckedChange={row.getToggleSelectedHandler()}
      disabled={!row.getCanSelect()}
    />
  ),
  size: 24,
})
