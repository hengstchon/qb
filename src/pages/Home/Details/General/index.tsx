import { useAtom } from 'jotai'
import useSWR from 'swr'
import {
  formatBytes,
  formatDuration,
  formatSpeed,
  formatTimestamp,
} from '@/lib/utils'
import { API } from '@/api/endpoints'
import { Propperties } from '@/lib/types'
import { MAX_ETA } from '@/lib/constants'
import { getCurrHashAtom } from '../../atoms'

const General = () => {
  const [currHash] = useAtom(getCurrHashAtom)

  const { data } = useSWR<Propperties>(
    currHash ? API.torrents.preperties(currHash) : null,
    { keepPreviousData: true }
  )

  const {
    addition_date = null,
    comment,
    completion_date = null,
    created_by,
    creation_date = null,
    dl_limit = -1,
    dl_speed = 0,
    dl_speed_avg = 0,
    // download_path,
    eta = 0,
    // infohash_v1,
    // infohash_v2,
    last_seen = null,
    nb_connections = 0,
    nb_connections_limit = 100,
    peers = 0,
    peers_total = 0,
    piece_size = 0,
    pieces_have = 0,
    pieces_num = 0,
    reannounce = 0,
    save_path = '',
    seeding_time = 0,
    seeds = 0,
    seeds_total = 0,
    share_ratio = 0,
    time_elapsed = 0,
    total_downloaded = 0,
    total_downloaded_session = 0,
    total_size = 0,
    total_uploaded = 0,
    total_uploaded_session = 0,
    total_wasted = 0,
    up_limit = -1,
    up_speed = 0,
    up_speed_avg = 0,
  } = data || {}

  const timeActive =
    seeding_time! > 0
      ? `${formatDuration(time_elapsed!)} (seeded for ${formatDuration(
          seeding_time!
        )})`
      : formatDuration(time_elapsed!)

  return (
    <div className="grid gap-4">
      <div className="">
        <h2 className="mb-2 border-b font-semibold">Transfer</h2>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <span>Time Active: {timeActive}</span>
          <span>ETA: {formatDuration(eta, MAX_ETA)}</span>
          <span>
            Connections: {nb_connections} (
            {nb_connections_limit < 0 ? '∞' : nb_connections_limit} max)
          </span>
          <span>
            Downloaded: {formatBytes(total_downloaded)} (
            {formatBytes(total_downloaded_session)} this session)
          </span>
          <span>
            Uploaded: {formatBytes(total_uploaded)} (
            {formatBytes(total_uploaded_session)} this session)
          </span>
          <span>
            Seeds: {seeds} ({seeds_total} total)
          </span>
          <span>
            Download Speed: {formatSpeed(dl_speed)} ({formatSpeed(dl_speed_avg)}{' '}
            avg.)
          </span>
          <span>
            Upload Speed: {formatSpeed(up_speed)} ({formatSpeed(up_speed_avg)}{' '}
            avg.)
          </span>
          <span>
            Peers: {peers} ({peers_total} total)
          </span>
          <span>
            Download Limit: {dl_limit === -1 ? '∞' : formatSpeed(dl_limit)}
          </span>
          <span>
            Upload Limit: {up_limit === -1 ? '∞' : formatSpeed(up_limit)}
          </span>
          <span>Wasted: {formatBytes(total_wasted)}</span>
          <span>Share Ratio: {share_ratio.toFixed(2)}</span>
          <span>Reannounce In: {formatDuration(reannounce)}</span>
          <span>
            Last Seen Complete:{' '}
            {last_seen === -1 ? 'Never' : formatTimestamp(last_seen)}
          </span>
        </div>
      </div>

      <div>
        <h2 className="mb-2 border-b font-semibold">Information</h2>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <span>Total Size: {formatBytes(total_size)}</span>
          <span>
            Pieces: {pieces_num} x {formatBytes(piece_size)} (have {pieces_have}
            )
          </span>
          <span>Created By: {created_by}</span>
          <span>Added On: {formatTimestamp(addition_date)}</span>
          <span>Completed On: {formatTimestamp(completion_date)}</span>
          <span>Created On: {formatTimestamp(creation_date)}</span>
          <span>Torrent Hash: {currHash}</span>
          <span>Save Path: {save_path}</span>
          <span>Comment: {comment}</span>
        </div>
      </div>
    </div>
  )
}

export default General
