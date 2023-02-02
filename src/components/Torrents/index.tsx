import { Torrent } from '@/types'
import { formatBytes, formatPercentage, formatTimestamp } from '@/utils'
import { API } from '@/utils/api'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import useSWR from 'swr'

const ch = createColumnHelper<Torrent>()

const columns = [
  ch.accessor('name', {}),
  ch.accessor('size', {
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('total_size', {
    header: 'total size',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('progress', {
    cell: (p) => formatPercentage(p.getValue()),
  }),
  ch.accessor('downloaded', {
    header: 'downloaded',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('uploaded', {
    header: 'uploaded',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('state', {
    header: 'status',
  }),
  ch.accessor((row) => `${row.num_seeds}(${row.num_complete})`, {
    header: 'seeds',
  }),
  ch.accessor((row) => `${row.num_leechs}(${row.num_incomplete})`, {
    header: 'peers',
  }),
  ch.accessor('dlspeed', {
    header: 'down speed',
  }),
  ch.accessor('upspeed', {
    header: 'up speed',
  }),
  ch.accessor('eta', {}),
  ch.accessor('ratio', {}),
  ch.accessor('category', {}),
  ch.accessor('tags', {}),
  ch.accessor('added_on', {
    header: 'Added On',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('completion_on', {
    header: 'Completed On',
    cell: (p) => formatTimestamp(p.getValue()),
  }),
  ch.accessor('tracker', {}),
  ch.accessor('dl_limit', {}),
  ch.accessor('up_limit', {}),
  ch.accessor('downloaded_session', {}),
  ch.accessor('uploaded_limit', {}),
  ch.accessor('time_active', {}),
  ch.accessor('amount_left', {
    header: 'Remaining',
    cell: (p) => formatBytes(p.getValue()),
  }),
  ch.accessor('save_path', {}),
  ch.accessor('completed', {}),
  ch.accessor('ratio_limit', {}),
  ch.accessor('seen_complete', {}),
  ch.accessor('last_activity', {}),
  ch.accessor('availability', {}),
]

const Torrents = () => {
  const { data, isLoading } = useSWR(API.torrentInfo(), {
    fallbackData: [],
  })

  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="min-w-0 flex-1 bg-yellow-50">
      <div className="w-full overflow-auto">
        <table className="w-full table-auto border-collapse border text-sm">
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border capitalize">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Log tors={data} />
    </div>
  )
}

const Log = ({ tors }: { tors: Torrent[] }) => {
  return (
    <div>
      {tors.map((t, i) => (
        <div key={i}>
          <span>-------------------------------</span>
          <div key={i} className="mb-4">
            {Object.keys(t).map((k, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span>{k}:</span>
                <span className="ml-4">{JSON.stringify(t[k])}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Torrents
