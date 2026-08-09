import ReactCountryFlag from 'react-country-flag'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { selectColumnDef } from '@/components/common/DataTable/selectColumn'
import { PeerType } from '@/types'
import { Badge } from '@/ui/Badge'
import { formatBytes, formatPercentage, formatSpeed } from '@/utils'

const ch = createColumnHelper<PeerType>()

export const peersColumns = [
  selectColumnDef as ColumnDef<PeerType>,
  ch.accessor(({ country_code, country }) => ({ country_code, country }), {
    id: 'countryRegion',
    header: 'Country/Region',
    size: 50,
    cell: (p) => {
      const { country_code, country } = p.getValue()
      return country_code ? (
        <ReactCountryFlag
          className="text-center"
          countryCode={country_code}
          aria-label={country ?? country_code}
        />
      ) : null
    },
  }),
  ch.accessor(({ ip, i2p_dest }) => ({ ip, i2p_dest }), {
    id: 'ip',
    header: 'Address',
    size: 200,
    cell: (p) => {
      const { ip, i2p_dest } = p.getValue()
      return (
        <span className="flex min-w-0 items-center gap-2">
          {i2p_dest && <Badge variant="outline">I2P</Badge>}
          <span className="truncate" title={i2p_dest ?? ip}>
            {i2p_dest ?? ip ?? 'Unknown peer'}
          </span>
        </span>
      )
    },
  }),
  ch.accessor('host_name', {
    id: 'hostName',
    header: 'Host name',
    size: 200,
    cell: (p) => p.getValue() || '—',
  }),
  ch.accessor('port', {
    id: 'port',
    header: 'Port',
    size: 100,
    cell: (p) => p.getValue() ?? '—',
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
    cell: (p) => formatPercentage(p.getValue() ?? 0),
  }),
  ch.accessor('dl_speed', {
    id: 'dl_speed',
    header: 'Down Speed',
    size: 100,
    cell: (p) => formatSpeed(p.getValue() ?? 0),
  }),
  ch.accessor('up_speed', {
    id: 'up_speed',
    header: 'Up Speed',
    size: 100,
    cell: (p) => formatSpeed(p.getValue() ?? 0),
  }),
  ch.accessor('downloaded', {
    id: 'downloaded',
    header: 'Downloaded',
    size: 100,
    cell: (p) => formatBytes(p.getValue() ?? 0),
  }),
  ch.accessor('uploaded', {
    id: 'uploaded',
    header: 'Uploaded',
    size: 100,
    cell: (p) => formatBytes(p.getValue() ?? 0),
  }),
  ch.accessor('relevance', {
    id: 'relevance',
    header: 'Relevance',
    size: 100,
    cell: (p) => formatPercentage(p.getValue() ?? 0),
  }),
  ch.accessor('files', {
    id: 'files',
    header: 'Files',
    size: 100,
  }),
]
