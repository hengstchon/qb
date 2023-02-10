import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import Torrents from '@/components/Torrents'
import {
  SyncData,
  ServerState,
  TorrentState,
  TrackerState,
  CategoryState,
  TagState,
} from '@/types'
import { atom, useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/utils/api'
import { useEffect } from 'react'

const torrentsAtom = atom<TorrentState>({})
const trackersAtom = atom<TrackerState>({})
const categoriesAtom = atom<CategoryState>({})
const tagsAtom = atom<TagState>([])
const serverStateAtom = atom<ServerState>({
  alltime_dl: 0,
  alltime_ul: 0,
  average_time_queue: 0,
  connection_status: '',
  dht_nodes: 0,
  dl_info_data: 0,
  dl_info_speed: 0,
  dl_rate_limit: 0,
  free_space_on_disk: 0,
  global_ratio: '',
  queued_io_jobs: 0,
  queueing: false,
  read_cache_hits: '',
  read_cache_overload: '',
  refresh_interval: 0,
  total_buffers_size: 0,
  total_peer_connections: 0,
  total_queued_size: 0,
  total_wasted_session: 0,
  up_info_data: 0,
  up_info_speed: 0,
  up_rate_limit: 0,
  use_alt_speed_limits: false,
  write_cache_overload: '',
})

const ridAtom = atom(0)
export const refreshIntervalAtom = atom(3000)

const updateDataAtom = atom(null, (_, set, val: SyncData) => {
  if (val.full_update) {
    set(torrentsAtom, val.torrents as TorrentState)
    set(trackersAtom, val.trackers as TrackerState)
    set(categoriesAtom, val.categories as CategoryState)
    set(tagsAtom, val.tags as TagState)
    set(serverStateAtom, val.server_state as ServerState)
  } else {
    for (const key in val) {
      switch (key) {
        case 'tags':
          set(tagsAtom, (prev) => [...prev, ...val.tags!])
          break
        case 'tags_removed':
          set(tagsAtom, (prev) => prev.filter((v) => !val.tags?.includes(v)))
          break
        case 'categories':
          set(categoriesAtom, (prev) => ({ ...prev, ...val.categories }))
          break
        case 'categories_removed':
          set(categoriesAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.categories_removed?.includes(k)
              )
            )
          )
          break
        case 'trackers':
          set(trackersAtom, (prev) => ({ ...prev, ...val.trackers }))
          break
        case 'trackers_removed':
          set(trackersAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.trackers_removed?.includes(k)
              )
            )
          )
          break
        case 'torrents': {
          set(torrentsAtom, (prev) => {
            for (const [hash, prop] of Object.entries(val.torrents!)) {
              if (Object.keys(prev).includes(hash)) {
                prev[hash] = { ...prev[hash], ...prop }
              } else {
                prev[hash] = prop
              }
            }
            return prev
          })
          break
        }
        case 'torrents_removed':
          set(torrentsAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.torrents_removed?.includes(k)
              )
            )
          )
          break
        case 'server_state':
          set(serverStateAtom, (prev) => ({ ...prev, ...val.server_state }))
          break
      }
    }
  }
})

const MainPage = () => {
  const [rid, setRid] = useAtom(ridAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const [torrents] = useAtom(torrentsAtom)
  const setUpdateDataAtom = useSetAtom(updateDataAtom)

  const { data } = useSWRImmutable(API.syncMain(rid), {
    onSuccess: (data) => {
      setUpdateDataAtom(data)
    },
  })
  useEffect(() => {
    if (!data?.rid) return
    const pollingInterval = refreshInterval
    const id = setTimeout(() => {
      setRid(data.rid)
    }, pollingInterval)
    return () => clearTimeout(id)
  }, [data, refreshInterval])
  // useEffect(() => {
  //   console.log(`torrents: ${new Date().toJSON()}`, mainData.torrents)
  // }, [mainData])
  // useEffect(() => {
  //   console.log(`data: ${new Date().toJSON()}`, data)
  // }, [data])

  // const torrents = useMemo(() => mainData.torrents, [mainData])
  // console.log(`torrents: ${new Date().toJSON()}`, torrents)

  // const { data: torrents } = useSWR(API.torrentInfo(), {
  //   refreshInterval: 1000,
  //   fallbackData: [],
  // })
  // console.log(`torrents: ${new Date().toLocaleTimeString()}`, torrents)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="flex h-[calc(100vh-3rem)] flex-1">
        <Sidebar />
        {/* {Math.random()} */}
        {Object.keys(torrents).length && (
          <Torrents torrents={Object.values(torrents)} />
        )}
      </div>
    </div>
  )
}

export default MainPage
