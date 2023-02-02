import { API } from '@/utils/api'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import useSWR from 'swr'

type TorrentProps = {
  added_on: number
  amount_left: number
  auto_tmm: boolean
  availability: number
  category: string
  completed: number
  completion_on: number
  content_path: string
  dl_limit: number
  dlspeed: number
  downloaded: number
  downloaded_session: number
  eta: number
  f_l_piece_prio: boolean
  force_start: boolean
  hash: string
  last_activity: number
  magnet_uri: string
  max_ratio: number
  max_seeding_time: number
  name: string
  num_complete: number
  num_incomplete: number
  num_leechs: number
  num_seeds: number
  priority: number
  progress: number
  ratio: number
  ratio_limit: number
  save_path: string
  seeding_time: number
  seeding_time_limit: number
  seen_complete: number
  seq_dl: boolean
  size: number
  state: string
  super_seeding: boolean
  tags: string
  time_active: number
  total_size: number
  tracker: string
  up_limit: number
  uploaded: number
  uploaded_session: number
  upspeed: number
  [key: string]: number | string | boolean
}

const Torrents = () => {
  const { data, isLoading } = useSWR(API.torrentInfo(), {
    fallbackData: [],
  })
  console.log('data: ', data && data[0])

  const columnHelper = createColumnHelper<TorrentProps>()

  const columns = [
    columnHelper.accessor('name', {
      header: (info) => info.column.id,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('added_on', {
      header: 'Added on',
      cell: (info) => info.getValue(),
    }),
  ]

  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="min-w-0 flex-1 bg-yellow-50">
      <table>
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
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
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Log tors={data} />
    </div>
  )
}

const Log = ({ tors }: { tors: TorrentProps[] }) => {
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
