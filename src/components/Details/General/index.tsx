import { currentTorHashAtom } from '@/components/Torrents/atoms'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { formatBytes, formatDuration, formatTimestamp, MAX_ETA } from '@/utils'
import { API } from '@/utils/api'
import { Propperties } from '@/types'

const General = () => {
  const [currTorHash] = useAtom(currentTorHashAtom)
  const { data } = useSWR<Propperties>(
    currTorHash ? API.torrents.preperties(currTorHash) : null
  )
  console.log(data)
  const {
    addition_date = null,
    comment,
    completion_date = null,
    created_by,
    creation_date = null,
    dl_limit,
    dl_speed,
    dl_speed_avg,
    download_path,
    eta,
    infohash_v1,
    infohash_v2,
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
    up_limit = 0,
    up_speed = 0,
    up_speed_avg = 0,
  } = data || {}

  // const fmActive = formatDuration(time_active)
  // const fmSeeding = formatDuration(seeding_time)
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
          <span>Downloaded:</span>
          <span>Uploaded:</span>
          <span>Seeds:</span>
          <span>Download Speed:</span>
          <span>Upload Speed:</span>
          <span>Peers:</span>
          <span>Download Limit:</span>
          <span>Upload Limit:</span>
          <span>Wasted: {formatBytes(total_wasted)}</span>
          <span>Share Ratio: {share_ratio.toFixed(2)}</span>
          <span>Reannounce In: {formatDuration(reannounce)}</span>
          <span>Last Seen Complete: {formatTimestamp(last_seen)}</span>
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
          <span>Torrent Hash:</span>
          <span>Save Path: {save_path}</span>
          <span>Comment: {comment}</span>
        </div>
      </div>
    </div>
  )
}

export default General
