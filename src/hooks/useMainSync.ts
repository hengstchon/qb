import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/utils/api'
import { useEffect } from 'react'
import {
  refreshIntervalAtom,
  mainRidAtom,
  updateMainDataAtom,
} from '@/components/Homepage/atoms'

export const useUpdateMainSync = () => {
  const [rid, setRid] = useAtom(mainRidAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdateMainData = useSetAtom(updateMainDataAtom)

  const { data, mutate } = useSWRImmutable(API.sync.maindata(rid), {
    onSuccess: (data, key, config) => {
      // console.log('data.rid: ', data.rid)
      // console.log('refreshInterval:', refreshInterval)

      setUpdateMainData(data)
      if (data.rid) {
        const timeId = setTimeout(() => {
          setRid(data.rid)
        }, refreshInterval)
      }
    },
    // onError: (err, key, config) => {
    //   console.log('err:', err)
    // },
    // onErrorRetry: (error, key, config, revalidate, ops) => {
    //   // Never retry on 404.
    //   if (error.status === 404) return
    //
    //   // Never retry for a specific key.
    //   if (key === '/api/user') return
    //
    //   // Only retry up to 10 times.
    //   // if (retryCount >= 10) return
    //
    //   // Retry after 5 seconds.
    //   // setTimeout(() => revalidate({ retryCount }), 5000)
    //   console.log('ops:', ops)
    // },
  })

  // useEffect(() => {
  //   mutate()
  // }, [refreshInterval])
}
