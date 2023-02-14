import { Tracker } from '@/types'
import { createColumnHelper } from '@tanstack/react-table'

const ch = createColumnHelper<Tracker>()

export const trkscolumns = [
  ch.accessor('tier', {
    id: 'tier',
    header: 'Tier',
    size: 60,
  }),
  ch.accessor('url', {
    id: 'url',
    header: 'Url',
    size: 120,
  }),
  ch.accessor('status', {
    id: 'status',
    header: 'Status',
    size: 120,
  }),
  ch.accessor('num_peers', {
    id: 'peers',
    header: 'Peers',
    size: 120,
  }),
  ch.accessor('num_seeds', {
    id: 'seeds',
    header: 'Seeds',
    size: 120,
  }),
  ch.accessor('num_leeches', {
    id: 'leeches',
    header: 'Leeches',
    size: 120,
  }),
  ch.accessor('num_downloaded', {
    id: 'downloaded',
    header: 'Downloaded',
    size: 120,
  }),
  ch.accessor('msg', {
    id: 'msg',
    header: 'Message',
    size: 120,
  }),
]
