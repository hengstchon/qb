import { MainDataType, SyncDataType } from '@/types'
import { API } from '@/utils/api'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import useSWR from 'swr'

const syncDataAtom = atom<SyncDataType>({
  rid: 0,
  torrents: {},
  categories: {},
  tags: [],
  trackers: {},
  server_state: {},
})

const mainDataAtom = atom<MainDataType>({
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

// const ridAtom = atom(
//   (get) => get(syncDataAtom).rid,
//   (_, set, val: number) =>
//     set(syncDataAtom, (prev: SyncDataType) => ({ ...prev, rid: val }))
// )

const ridAtom = atom(0)

type InitSyncDataType = MainDataType & {
  rid: number
  full_update: boolean
}

const initMainDataAtom = atom(null, (_, set, val: InitSyncDataType) =>
  set(mainDataAtom, (prev) => {
    // const o = {} as MainDataType
    // for (const [k, v] of Object.entries(val)) {
    //   if (k in prev) {
    //     o[k as keyof MainDataType] = v as MainDataType[keyof MainDataType]
    //   }
    // }
    // return o
    Object.keys(val)
  })
)

const updateMainDataAtom = atom(null, (_, set, val: SyncDataType) =>
  set(mainDataAtom, (prev) => ({ ...prev, ...val }))
)

const Test = () => {
  const [rid] = useAtom(ridAtom)
  const [mainData] = useAtom(mainDataAtom)
  const setInitDataAtom = useSetAtom(initMainDataAtom)
  const setUpdateDataAtom = useSetAtom(updateMainDataAtom)

  const { data } = useSWR(API.syncMain(rid), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // onSuccess: (data) => {
    //   setTimeout(() => {
    //     if (data.full_update) {
    //       setInitDataAtom(data)
    //     } else {
    //       // setUpdateDataAtom(data)
    //     }
    //   }, 3000)
    // },
    // fallbackData: {},
  })

  useEffect(() => {
    if (!data?.rid) return

    console.log(`data: ${new Date().toLocaleTimeString()}`, data)
    const pollingInterval = 3000
    const id = setTimeout(() => {
      if (data.full_update) {
        setInitDataAtom(data)
      } else {
        // setUpdateDataAtom(data)
      }
    }, pollingInterval)
    return () => clearTimeout(id)
  }, [data])

  // console.log(`data: ${new Date().toLocaleTimeString()}`, data)
  // console.log(`syncData: ${new Date().toLocaleTimeString()}`, syncData)

  return (
    <div className="h-screen overflow-auto bg-slate-700 p-8 text-slate-200">
      <div>{Math.random()}</div>
      <div>
        {/* <div className="text-red-300"> */}
        {/*   <h1>data:</h1> */}
        {/*   {Object.keys(data).map((k, i) => ( */}
        {/*     <div key={i} className="whitespace-pre-wrap break-words"> */}
        {/*       <span>{k}:</span> */}
        {/*       <span className="ml-4 opacity-60">{JSON.stringify(data[k])}</span> */}
        {/*     </div> */}
        {/*   ))} */}
        {/* </div> */}
        <div className="text-blue-300">
          <h1 className="mt-4">mainData:</h1>
          {Object.keys(mainData).map((k, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              <span>{k}:</span>
              <span className="ml-4 opacity-60">
                {JSON.stringify(mainData[k as keyof MainDataType])}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Test
