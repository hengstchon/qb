import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/common/DataTable/selectColumn'
import { trackerStatusLabel } from '@/services/normalizers'
import { Tracker } from '@/types'
import { formatDuration } from '@/utils'

const ch = createColumnHelper<Tracker>()

export const trksColumns = [
  selectColumnDef as ColumnDef<Tracker>,
  ch.accessor('tier', {
    id: 'tier',
    header: 'Tier',
    size: 50,
    cell: (p) => (p.getValue() < 0 ? null : p.getValue()),
  }),
  ch.accessor('url', {
    id: 'url',
    header: 'Url',
    size: 200,
  }),
  ch.accessor('status', {
    id: 'status',
    header: 'Status',
    size: 100,
    cell: (p) => trackerStatusLabel(p.getValue()),
  }),
  ch.accessor('num_peers', {
    id: 'peers',
    header: 'Peers',
    size: 100,
  }),
  ch.accessor('num_seeds', {
    id: 'seeds',
    header: 'Seeds',
    size: 100,
  }),
  ch.accessor('num_leeches', {
    id: 'leeches',
    header: 'Leeches',
    size: 100,
  }),
  ch.accessor('num_downloaded', {
    id: 'downloaded',
    header: 'Downloaded',
    size: 100,
  }),
  ch.accessor('msg', {
    id: 'msg',
    header: 'Message',
    size: 300,
  }),
  ch.accessor('next_announce', {
    id: 'nextAnnounce',
    header: 'Next announce',
    size: 120,
    cell: (p) =>
      p.getValue() == null ? '—' : formatDuration(p.getValue() as number),
  }),
  ch.accessor('min_announce', {
    id: 'minAnnounce',
    header: 'Minimum announce',
    size: 140,
    cell: (p) =>
      p.getValue() == null ? '—' : formatDuration(p.getValue() as number),
  }),
  ch.accessor('endpoints', {
    id: 'endpoints',
    header: 'Endpoints',
    size: 180,
    cell: (p) =>
      p
        .getValue()
        ?.map((endpoint) => endpoint.name)
        .join(', ') || '—',
  }),
]
