import { File } from '@/types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/BaseTable'
import { formatBytes, formatPercentage } from '@/utils'

const ch = createColumnHelper<File>()

export const filesColumns = [
  selectColumnDef as ColumnDef<File>,
  ch.accessor('name', {
    id: 'name',
    header: 'Name',
    size: 200,
  }),
  ch.accessor('size', {
    id: 'size',
    header: 'Size',
    size: 100,
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('progress', {
    id: 'progress',
    header: 'Progress',
    size: 100,
    cell: (p) => formatPercentage(p.getValue()),
  }),
  ch.accessor('priority', {
    id: 'priority',
    header: 'Priority',
    size: 100,
  }),
  ch.accessor(({ size, progress }) => ({ size, progress }), {
    id: 'remaining',
    header: 'Remaining',
    size: 100,
    cell: (p) => {
      const { size, progress } = p.getValue()
      return formatBytes(size * (1 - progress))
    },
  }),
  ch.accessor('availability', {
    id: 'availability',
    header: 'Availability',
    size: 100,
    cell: (p) => formatPercentage(p.getValue()),
  }),
]
