import { File } from '@/types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/Table'
import { formatBytes, formatPercentage } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  FileIcon,
  FolderClosedIcon,
  FolderOpenIcon,
} from 'lucide-react'

const ch = createColumnHelper<File>()

const collapsedIcon = <ChevronRight className="mr-1 h-4 w-4 flex-none" />
const expandedIcon = <ChevronDown className="mr-1 h-4 w-4 flex-none" />

export const filesColumns = [
  selectColumnDef as ColumnDef<File>,
  ch.accessor('name', {
    id: 'name',
    header: ({ table }) => (
      <>
        <button onClick={table.getToggleAllRowsExpandedHandler()}>
          {table.getIsAllRowsExpanded() ? expandedIcon : collapsedIcon}
        </button>{' '}
        Name
      </>
    ),
    cell: ({ row, getValue }) => (
      <>
        {row.getCanExpand() ? (
          <>
            <button
              onClick={row.getToggleExpandedHandler()}
              style={{ marginLeft: `${row.depth * 2}rem` }}
            >
              {row.getIsExpanded() ? expandedIcon : collapsedIcon}
            </button>
            {row.getIsExpanded() ? (
              <FolderOpenIcon className="mr-1 h-4 w-4 flex-none" />
            ) : (
              <FolderClosedIcon className="mr-1 h-4 w-4 flex-none" />
            )}
          </>
        ) : (
          <FileIcon
            className="mr-1 h-4 w-4 flex-none"
            style={{ marginLeft: `${row.depth * 2}rem` }}
          />
        )}{' '}
        {getValue()}
      </>
    ),
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
