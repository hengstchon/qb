import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import Torrents from '@/components/Torrents'
import { MainData, SyncData } from '@/types'
import { atom, useAtom, useSetAtom } from 'jotai'
import useSWR from 'swr'
import { API } from '@/utils/api'
import { useEffect } from 'react'

const mainDataAtom = atom<MainData>({
  torrents: {},
  categories: {},
  tags: [],
  trackers: {},
  server_state: {
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
  },
})

const ridAtom = atom(0)

const updateDataAtom = atom(null, (_, set, val: SyncData) =>
  set(mainDataAtom, (prev) => {
    if (val.full_update) {
      return Object.fromEntries(
        Object.entries(val).filter(([k]) => k in prev)
      ) as MainData
    }

    const o = prev
    for (const key in val) {
      switch (key) {
        case 'tags':
          o.tags = [...o.tags, ...val.tags!]
          break
        case 'tags_removed':
          o.tags = o.tags.filter((e) => !val.tags?.includes(e))
          break
        case 'categories':
          o.categories = { ...o.categories, ...val.categories }
          break
        case 'categories_removed':
          o.categories = Object.fromEntries(
            Object.entries(o.categories).filter(
              ([k]) => !val.categories_removed?.includes(k)
            )
          )
          break
        case 'trackers':
          o.categories = { ...o.categories, ...val.categories }
          break
        case 'trackers_removed':
          o.categories = Object.fromEntries(
            Object.entries(o.categories).filter(
              ([k]) => !val.trackers_removed?.includes(k)
            )
          )
          break
        case 'torrents': {
          for (const [hash, prop] of Object.entries(val.torrents!)) {
            if (Object.keys(o.torrents).includes(hash)) {
              o.torrents[hash] = { ...o.torrents[hash], ...prop }
            } else {
              o.torrents[hash] = prop
            }
          }
          break
        }
        case 'torrents_removed':
          o.torrents = Object.fromEntries(
            Object.entries(o.torrents).filter(
              ([k]) => !val.torrents_removed?.includes(k)
            )
          )
          break

        case 'server_state':
          o.server_state = { ...o.server_state, ...val.server_state }
          break
        default:
          break
      }
    }
    return o
  })
)

const MainPage = () => {
  const [rid, setRid] = useAtom(ridAtom)
  const [mainData] = useAtom(mainDataAtom)
  const setUpdateDataAtom = useSetAtom(updateDataAtom)

  // const { data } = useSWR(API.syncMain(rid), {
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // })
  //
  // useEffect(() => {
  //   if (!data?.rid) return
  //   // console.log(`data: ${new Date().toLocaleTimeString()}`, data)
  //   const pollingInterval = 3000
  //   const id = setTimeout(() => {
  //     setRid(data.rid)
  //     setUpdateDataAtom(data)
  //   }, pollingInterval)
  //   return () => clearTimeout(id)
  // }, [data])
  //
  // // console.log(`data: ${new Date().toLocaleTimeString()}`, data)
  // console.log(`mainData: ${new Date().toLocaleTimeString()}`, mainData)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="flex h-[calc(100vh-3rem)] flex-1">
        <Sidebar />
        {/* {Math.random()} */}
        <Torrents />
      </div>
    </div>
  )
}

export default MainPage
