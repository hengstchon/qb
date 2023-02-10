import { Torrent } from '@/types'
import { Checkbox } from '@/ui/Checkbox'
import {
  formatBytes,
  formatDuration,
  formatPercentage,
  formatSpeed,
  formatTimestamp,
  MAX_ETA,
} from '@/utils'
import { createColumnHelper, SortingFn } from '@tanstack/react-table'

const sortingFnWithField =
  <T extends Record<string, number>>(field: string): SortingFn<Torrent> =>
  (rowA, rowB, columnId) =>
    (rowA.getValue(columnId) as T)[field] >
    (rowB.getValue(columnId) as T)[field]
      ? 1
      : -1

const ch = createColumnHelper<Torrent>()

export const columns = [
  ch.display({
    id: 'select',
    enableSorting: false,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
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
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
        disabled={!row.getCanSelect()}
      />
    ),
  }),
  ch.accessor('name', {
    header: 'Name',
    size: 360,
  }),
  ch.accessor('size', {
    header: 'Size',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('total_size', {
    header: 'Total Size',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('progress', {
    header: 'Done',
    cell: (p) => formatPercentage(p.getValue()),
    size: 120,
  }),
  ch.accessor('downloaded', {
    header: 'Downloaded',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('uploaded', {
    header: 'Uploaded',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('state', {
    header: 'Status',
    size: 120,
  }),
  ch.accessor(({ num_seeds, num_complete }) => ({ num_seeds, num_complete }), {
    id: 'seeds',
    header: 'Seeds',
    cell: (p) => {
      const { num_seeds, num_complete } = p.getValue()
      return `${num_seeds}(${num_complete})`
    },
    sortingFn: sortingFnWithField('num_seeds'),
    size: 120,
  }),
  ch.accessor(
    ({ num_leechs, num_incomplete }) => ({ num_leechs, num_incomplete }),
    {
      id: 'peers',
      header: 'Peers',
      cell: (p) => {
        const { num_leechs, num_incomplete } = p.getValue()
        return `${num_leechs}(${num_incomplete})`
      },
      sortingFn: sortingFnWithField('num_leechs'),
      size: 120,
    }
  ),
  ch.accessor('dlspeed', {
    header: 'Down Speed',
    cell: (p) => formatSpeed(p.getValue(), 1),
    size: 120,
  }),
  ch.accessor('upspeed', {
    header: 'Up Speed',
    cell: (p) => formatSpeed(p.getValue(), 1),
    size: 120,
  }),
  ch.accessor('eta', {
    header: 'ETA',
    cell: (p) => formatDuration(p.getValue(), MAX_ETA),
    size: 120,
  }),
  ch.accessor('ratio', {
    header: 'Ratio',
    cell: (p) => p.getValue().toFixed(2),
    size: 120,
  }),
  ch.accessor('category', {
    header: 'Category',
    size: 120,
  }),
  ch.accessor('tags', {
    header: 'Tags',
    size: 120,
  }),
  ch.accessor('added_on', {
    header: 'Added On',
    cell: (p) => formatTimestamp(p.getValue()),
    size: 160,
  }),
  ch.accessor('completion_on', {
    header: 'Completed On',
    cell: (p) => p.getValue() > 0 && formatTimestamp(p.getValue()),
    size: 160,
  }),
  ch.accessor('tracker', {
    header: 'Tracker',
  }),
  ch.accessor('dl_limit', {
    header: 'Down Limit',
    cell: (p) => (p.getValue() > 0 ? formatSpeed(p.getValue(), 1) : '∞'),
    size: 120,
  }),
  ch.accessor('up_limit', {
    header: 'Up limit',
    cell: (p) => (p.getValue() > 0 ? formatSpeed(p.getValue(), 1) : '∞'),
    size: 120,
  }),
  ch.accessor('downloaded_session', {
    header: 'Session Download',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('uploaded_session', {
    header: 'Session Upload',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('amount_left', {
    header: 'Remaining',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor(
    ({ time_active, seeding_time }) => ({ time_active, seeding_time }),
    {
      id: 'time_active',
      header: 'Time Active',
      cell: (p) => {
        const { time_active, seeding_time } = p.getValue()
        const fmActive = formatDuration(time_active)
        const fmSeeding = formatDuration(seeding_time)
        return seeding_time > 0
          ? `${fmActive} (seeded for ${fmSeeding})`
          : fmActive
      },
      sortingFn: sortingFnWithField('time_active'),
      size: 100,
    }
  ),
  ch.accessor('save_path', {
    header: 'Save Path',
  }),
  ch.accessor('completed', {
    header: 'Completed',
    cell: (p) => formatBytes(p.getValue(), 1),
    size: 120,
  }),
  ch.accessor('ratio_limit', {
    header: 'Ratio Limit',
    cell: (p) => (p.getValue() >= 0 ? p.getValue() : '∞'),
    size: 100,
  }),
  ch.accessor('seen_complete', {
    header: 'Last Seen Complete',
    cell: (p) => formatTimestamp(p.getValue()),
    size: 160,
  }),
  ch.accessor('last_activity', {
    header: 'Last Activity',
    cell: (p) => {
      const timestamp = p.getValue()
      if (timestamp < 1) return '∞'
      return `${formatDuration(new Date().valueOf() / 1000 - timestamp)} ago`
    },
    size: 120,
  }),
  ch.accessor('availability', {
    header: 'Availability',
    cell: (p) => p.getValue().toFixed(3),
    size: 120,
  }),
]
