import { SyncDataType } from '@/types'
import { API } from '@/utils/api'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import useSWR from 'swr'

const syncDataAtom = atom<SyncDataType>({
  rid: 0,
  full_update: false,
  torrents: {},
  categories: {},
  tags: [],
  server_state: {},
  trackers: {},
})

const ridAtom = atom(
  (get) => get(syncDataAtom).rid,
  (_, set, val: number) =>
    set(syncDataAtom, (prev: SyncDataType) => ({ ...prev, rid: val }))
)

const initSyncDataAtom = atom(null, (_, set, val: SyncDataType) =>
  set(syncDataAtom, val)
)
const updateSyncDataAtom = atom(null, (_, set, val: Partial<SyncDataType>) =>
  set(syncDataAtom, (prev: SyncDataType) => ({ ...prev, ...val }))
)

const Test = () => {
  const [rid] = useAtom(ridAtom)
  const [syncData] = useAtom(syncDataAtom)
  const setInitDataAtom = useSetAtom(initSyncDataAtom)
  const setUpdateDataAtom = useSetAtom(updateSyncDataAtom)

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
          <h1 className="mt-4">syncData:</h1>
          {Object.keys(syncData).map((k, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              <span>{k}:</span>
              <span className="ml-4 opacity-60">
                {JSON.stringify(syncData[k as keyof SyncDataType])}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Test
