import ReactCountryFlag from 'react-country-flag'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/DataTable/selectColumn'
import { PeerType } from '@/lib/types'
import { formatBytes, formatPercentage, formatSpeed } from '@/lib/utils'

const ch = createColumnHelper<PeerType>()

export const peersColumns = [
  selectColumnDef as ColumnDef<PeerType>,
  ch.accessor(({ country_code, country }) => ({ country_code, country }), {
    id: 'countryRegion',
    header: 'Country/Region',
    size: 50,
    cell: (p) => {
      const { country_code, country } = p.getValue()
      return (
        <ReactCountryFlag
          className="text-center"
          countryCode={country_code}
          aria-label={country}
        />
      )
    },
  }),
  ch.accessor('ip', {
    id: 'ip',
    header: 'IP',
    size: 200,
  }),
  ch.accessor('port', {
    id: 'port',
    header: 'Port',
    size: 100,
  }),
  ch.accessor('connection', {
    id: 'connection',
    header: 'Connection',
    size: 100,
  }),
  ch.accessor('flags', {
    id: 'flags',
    header: 'Flags',
    size: 100,
  }),
  ch.accessor('client', {
    id: 'client',
    header: 'Client',
    size: 100,
  }),
  ch.accessor('progress', {
    id: 'progress',
    header: 'Progress',
    size: 100,
    cell: (p) => formatPercentage(p.getValue()),
  }),
  ch.accessor('dl_speed', {
    id: 'dl_speed',
    header: 'Down Speed',
    size: 100,
    cell: (p) => formatSpeed(p.getValue()),
  }),
  ch.accessor('up_speed', {
    id: 'up_speed',
    header: 'Up Speed',
    size: 100,
    cell: (p) => formatSpeed(p.getValue()),
  }),
  ch.accessor('downloaded', {
    id: 'downloaded',
    header: 'Downloaded',
    size: 100,
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('uploaded', {
    id: 'uploaded',
    header: 'Uploaded',
    size: 100,
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('relevance', {
    id: 'relevance',
    header: 'Relevance',
    size: 100,
    cell: (p) => formatPercentage(p.getValue()),
  }),
  ch.accessor('files', {
    id: 'files',
    header: 'Files',
    size: 100,
  }),
]
