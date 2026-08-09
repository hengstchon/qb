import { useEffect } from 'react'
import { atom, useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/services'
import { mergeMainData } from '@/services/mainData'
import {
  categoriesAtom,
  refreshIntervalAtom,
  serverStateAtom,
  tagsAtom,
  torrentsAtom,
  trackersAtom,
} from '@/store'
import { SyncData } from '@/types'

export const mainRidAtom = atom(0)

const updateMainDataAtom = atom(null, (get, set, newData: SyncData) => {
  const next = mergeMainData(
    {
      torrents: get(torrentsAtom),
      trackers: get(trackersAtom),
      categories: get(categoriesAtom),
      tags: get(tagsAtom),
      server_state: get(serverStateAtom),
    },
    newData,
  )

  set(torrentsAtom, next.torrents)
  set(trackersAtom, next.trackers)
  set(categoriesAtom, next.categories)
  set(tagsAtom, next.tags)
  set(serverStateAtom, next.server_state)
})

export const useSyncMainData = () => {
  const [rid, setRid] = useAtom(mainRidAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdateMainData = useSetAtom(updateMainDataAtom)

  const { data } = useSWRImmutable(API.sync.maindata(rid))

  useEffect(() => {
    if (data) {
      setUpdateMainData(data)
      if (data.rid) {
        const timeoutId = setTimeout(() => {
          setRid(data.rid)
        }, refreshInterval)
        return () => {
          clearTimeout(timeoutId)
        }
      }
    }
  }, [data, refreshInterval, setRid, setUpdateMainData])
}
