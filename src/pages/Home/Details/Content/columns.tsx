import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronRight,
  FileIcon,
  FolderClosedIcon,
  FolderOpenIcon,
} from 'lucide-react'
import { selectColumnDef } from '@/components/DataTable/selectColumn'
import { FilePriority } from '@/lib/constants'
import { FileNode } from '@/lib/types'
import { formatBytes, formatPercentage } from '@/lib/utils'
import { Button } from '@/ui/Button'

const ch = createColumnHelper<FileNode>()

const collapsedIcon = <ChevronRight className="mr-1 h-4 w-4 flex-none" />
const expandedIcon = <ChevronDown className="mr-1 h-4 w-4 flex-none" />

export const filesColumns = [
  selectColumnDef as ColumnDef<FileNode>,
  ch.accessor('name', {
    id: 'name',
    header: ({ table }) => (
      <>
        <Button
          className="h-4 p-0"
          variant="ghost"
          size="sm"
          onClick={table.getToggleAllRowsExpandedHandler()}
        >
          {table.getIsAllRowsExpanded() ? expandedIcon : collapsedIcon}
        </Button>{' '}
        Name
      </>
    ),
    cell: ({ row, getValue }) => (
      <>
        {row.getCanExpand() ? (
          <>
            <Button
              className="h-4 p-0"
              variant="ghost"
              size="sm"
              onClick={row.getToggleExpandedHandler()}
              style={{ marginLeft: `${row.depth * 2}rem` }}
            >
              {row.getIsExpanded() ? expandedIcon : collapsedIcon}
            </Button>
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
    meta: {
      className: 'justify-start',
    },
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
    cell: (p) => {
      switch (p.getValue()) {
        case FilePriority.Ignored:
          return 'Do not download'
        case FilePriority.Normal:
          return 'Normal'
        case FilePriority.High:
          return 'High'
        case FilePriority.Maximum:
          return 'Maximum'
        case FilePriority.Mixed:
          return 'Mixed'
        default:
          return 'Normal'
      }
    },
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
