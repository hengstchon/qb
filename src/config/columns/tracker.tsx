import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/common/DataTable/selectColumn'
import { trackerStatusLabel } from '@/services/normalizers'
import { Tracker } from '@/types'
import { Badge } from '@/ui/Badge'
import { formatAnnounceTime } from '@/utils'

const ch = createColumnHelper<Tracker>()

const statusClassName = (status: number) => {
  if (status === 4) return 'border-amber-500 text-amber-700 dark:text-amber-300'
  if (status === 5) return 'border-destructive text-destructive'
  if (status === 6) return 'border-red-700 text-red-700 dark:text-red-300'
  if (status < 0 || status > 6)
    return 'border-purple-500 text-purple-700 dark:text-purple-300'
  return undefined
}

const TrackerStatus = ({ status }: { status: number }) => (
  <Badge variant="outline" className={statusClassName(status)}>
    {trackerStatusLabel(status)}
  </Badge>
)

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
    cell: (p) => <TrackerStatus status={p.getValue()} />,
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
      p.getValue() == null ? '—' : formatAnnounceTime(p.getValue() as number),
  }),
  ch.accessor('min_announce', {
    id: 'minAnnounce',
    header: 'Minimum announce',
    size: 140,
    cell: (p) =>
      p.getValue() == null ? '—' : formatAnnounceTime(p.getValue() as number),
  }),
  ch.accessor('endpoints', {
    id: 'endpoints',
    header: 'Endpoints',
    size: 420,
    cell: (p) => {
      const endpoints = p.getValue()
      if (!endpoints?.length) return '—'
      return (
        <div className="w-full space-y-1 py-1">
          {endpoints.map((endpoint) => (
            <div key={endpoint.name} className="rounded border p-1.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <strong>{endpoint.name}</strong>
                <TrackerStatus status={endpoint.status} />
                {endpoint.updating && <span>Updating…</span>}
              </div>
              <div className="text-muted-foreground">
                Next {formatAnnounceTime(endpoint.next_announce ?? 0)} · Minimum{' '}
                {formatAnnounceTime(endpoint.min_announce ?? 0)}
              </div>
              {endpoint.msg && <div title={endpoint.msg}>{endpoint.msg}</div>}
            </div>
          ))}
        </div>
      )
    },
  }),
]
