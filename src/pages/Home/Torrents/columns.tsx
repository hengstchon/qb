import { ColumnDef, createColumnHelper, SortingFn } from '@tanstack/react-table'
import { Torrent } from '@/lib/types'
import {
  formatBytes,
  formatDuration,
  formatPercentage,
  formatSpeed,
  formatTimestamp,
} from '@/lib/utils'
import { MAX_ETA } from '@/lib/constants'
import { selectColumnDef } from '@/components/DataTable/selectColumn'

const sortingFnWithField =
  <T extends Record<string, number>>(field: string): SortingFn<Torrent> =>
  (rowA, rowB, columnId) =>
    (rowA.getValue(columnId) as T)[field] >
    (rowB.getValue(columnId) as T)[field]
      ? 1
      : -1

const ch = createColumnHelper<Torrent>()

export const torsColumns = [
  selectColumnDef as ColumnDef<Torrent>,
  ch.accessor('name', {
    id: 'name',
    header: 'Name',
    cell: (p) => (
      <div className="truncate" style={{ width: p.column.getSize() - 16 }}>
        {p.getValue()}
      </div>
    ),
    meta: {
      className: 'justify-start',
    },
    size: 400,
  }),
  ch.accessor('size', {
    id: 'size',
    header: 'Size',
    cell: (p) => <div className="w-[100px]">{formatBytes(p.getValue())}</div>,
    size: 120,
  }),
  ch.accessor('total_size', {
    id: 'total_size',
    header: () => <div className="min-w-[90px]">Total Size</div>,
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('progress', {
    id: 'progress',
    header: 'Done',
    cell: (p) => formatPercentage(p.getValue()),
    size: 120,
  }),
  ch.accessor('downloaded', {
    id: 'downloaded',
    header: 'Downloaded',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('uploaded', {
    id: 'uploaded',
    header: 'Uploaded',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('state', {
    id: 'state',
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
    id: 'dlspeed',
    header: 'Down Speed',
    cell: (p) => formatSpeed(p.getValue(), 1),
    size: 120,
  }),
  ch.accessor('upspeed', {
    id: 'upspeed',
    header: 'Up Speed',
    cell: (p) => formatSpeed(p.getValue(), 1),
    size: 120,
  }),
  ch.accessor('eta', {
    id: 'eta',
    header: 'ETA',
    cell: (p) => formatDuration(p.getValue(), MAX_ETA),
    size: 120,
  }),
  ch.accessor('ratio', {
    id: 'ratio',
    header: 'Ratio',
    cell: (p) => p.getValue().toFixed(2),
    size: 120,
  }),
  ch.accessor('category', {
    id: 'category',
    header: 'Category',
    size: 120,
  }),
  ch.accessor('tags', {
    id: 'tags',
    header: 'Tags',
    size: 120,
  }),
  ch.accessor('added_on', {
    id: 'added_on',
    header: 'Added On',
    cell: (p) => formatTimestamp(p.getValue()),
    size: 160,
  }),
  ch.accessor('completion_on', {
    id: 'completion_on',
    header: 'Completed On',
    cell: (p) => p.getValue() > 0 && formatTimestamp(p.getValue()),
    size: 160,
  }),
  ch.accessor('tracker', {
    id: 'tracker',
    header: 'Tracker',
    cell: (p) => <div className="max-w-[300px] truncate">{p.getValue()}</div>,
    size: 320,
  }),
  ch.accessor('dl_limit', {
    id: 'dl_limit',
    header: 'Down Limit',
    cell: (p) => (p.getValue() > 0 ? formatSpeed(p.getValue(), 1) : '∞'),
    size: 120,
  }),
  ch.accessor('up_limit', {
    id: 'up_limit',
    header: 'Up limit',
    cell: (p) => (p.getValue() > 0 ? formatSpeed(p.getValue(), 1) : '∞'),
    size: 120,
  }),
  ch.accessor('downloaded_session', {
    id: 'downloaded_session',
    header: 'Session Download',
    cell: (p) => formatBytes(p.getValue()),
    size: 140,
  }),
  ch.accessor('uploaded_session', {
    id: 'uploaded_session',
    header: 'Session Upload',
    cell: (p) => formatBytes(p.getValue()),
    size: 120,
  }),
  ch.accessor('amount_left', {
    id: 'amount_left',
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
      size: 200,
    }
  ),
  ch.accessor('save_path', {
    id: 'save_path',
    header: 'Save Path',
  }),
  ch.accessor('completed', {
    id: 'completed',
    header: 'Completed',
    cell: (p) => formatBytes(p.getValue(), 1),
    size: 120,
  }),
  ch.accessor('ratio_limit', {
    id: 'ratio_limit',
    header: 'Ratio Limit',
    cell: (p) => (p.getValue() >= 0 ? p.getValue() : '∞'),
    size: 100,
  }),
  ch.accessor('seen_complete', {
    id: 'seen_complete',
    header: 'Last Seen Complete',
    cell: (p) => formatTimestamp(p.getValue()),
    size: 160,
  }),
  ch.accessor('last_activity', {
    id: 'last_activity',
    header: 'Last Activity',
    cell: (p) => {
      const timestamp = p.getValue()
      if (timestamp < 1) return '∞'
      return `${formatDuration(new Date().valueOf() / 1000 - timestamp)} ago`
    },
    size: 120,
  }),
  ch.accessor('availability', {
    id: 'availability',
    header: 'Availability',
    cell: (p) => p.getValue().toFixed(3),
    size: 120,
  }),
]
