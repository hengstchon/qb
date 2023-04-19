import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/api/endpoints'
import { useEffect } from 'react'
import {
  refreshIntervalAtom,
  mainRidAtom,
  updateMainDataAtom,
} from '@/pages/Home/atoms'
import { useSWRConfig } from 'swr'

export const useUpdateMainSync = () => {
  const [rid, setRid] = useAtom(mainRidAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdateMainData = useSetAtom(updateMainDataAtom)
  const { onErrorRetry } = useSWRConfig()

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
    //   console.log('onError err:', err, key)
    // },
    onErrorRetry: (error, key, config, revalidate, opts) => {
      console.log('onErryrRetry:', error, key, opts)
      setTimeout(() => {
        console.log('revalidate: ', opts)
        revalidate(opts)
      }, refreshInterval)
    },
  })

  // useEffect(() => {
  //   mutate()
  // }, [refreshInterval])
}
