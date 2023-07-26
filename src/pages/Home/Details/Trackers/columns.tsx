import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/DataTable/selectColumn'
import { Tracker } from '@/lib/types'

const ch = createColumnHelper<Tracker>()

export const trksColumns = [
  selectColumnDef as ColumnDef<Tracker>,
  ch.accessor('tier', {
    id: 'tier',
    header: 'Tier',
    size: 50,
    cell: (p) => (parseInt(p.getValue()) < 0 ? null : p.getValue()),
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
]
