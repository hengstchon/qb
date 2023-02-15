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

  const { data } = useSWRImmutable(API.sync.maindata(rid), {
    onSuccess: (data) => {
      setUpdateMainData(data)
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
}
