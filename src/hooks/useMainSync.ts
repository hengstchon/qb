import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/api/endpoints'
import {
  refreshIntervalAtom,
  mainRidAtom,
  updateMainDataAtom,
} from '@/pages/Home/atoms'

export const useUpdateMainSync = () => {
  const [rid, setRid] = useAtom(mainRidAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdateMainData = useSetAtom(updateMainDataAtom)

  useSWRImmutable(API.sync.maindata(rid), {
    onSuccess: (data) => {
      // console.log('data.rid: ', data.rid)
      // console.log('refreshInterval:', refreshInterval)

      setUpdateMainData(data)
      if (data.rid) {
        setTimeout(() => {
          setRid(data.rid)
        }, refreshInterval)
      }
    },
    onErrorRetry: (error, key, _, revalidate, opts) => {
      console.log('onErryrRetry:', error, key, opts)
      setTimeout(() => {
        console.log('revalidate: ', opts)
        revalidate(opts)
      }, refreshInterval)
    },
  })
}
