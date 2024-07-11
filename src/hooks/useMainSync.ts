import { useEffect } from 'react'
import { produce } from 'immer'
import { atom, useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/services'
import {
  categoriesAtom,
  refreshIntervalAtom,
  serverStateAtom,
  tagsAtom,
  torrentsAtom,
  trackersAtom,
} from '@/store'
import { ServerState, SyncData, Torrent } from '@/types'

export const mainRidAtom = atom(0)

const removeProducer = (value: string[]) =>
  produce((draft) => {
    value.forEach((key) => delete draft[key])
  })

const updateMainDataAtom = atom(null, (_, set, newData: SyncData) => {
  if (newData.full_update) {
    const { torrents, trackers, categories, tags, server_state } = newData
    set(torrentsAtom, torrents!)
    set(trackersAtom, trackers!)
    set(categoriesAtom, categories!)
    set(tagsAtom, tags!)
    set(serverStateAtom, server_state as ServerState)
    return
  }

  for (const [key, value] of Object.entries(newData)) {
    switch (key) {
      case 'tags':
        set(tagsAtom, (prev) => [...prev, ...value])
        break
      case 'tags_removed':
        set(tagsAtom, (prev) => prev.filter((v) => !value.includes(v)))
        break
      case 'categories':
        set(categoriesAtom, (prev) => ({ ...prev, ...value }))
        break
      case 'categories_removed':
        set(categoriesAtom, removeProducer(value))
        break
      case 'trackers':
        set(trackersAtom, (prev) => ({ ...prev, ...value }))
        break
      case 'trackers_removed':
        set(trackersAtom, removeProducer(value))
        break
      case 'torrents': {
        set(
          torrentsAtom,
          produce((draft) => {
            Object.entries(value).forEach(([hash, props]) => {
              if (hash in draft) {
                Object.assign(draft[hash], props)
              } else {
                draft[hash] = props as Torrent
              }
            })
          }),
        )
        break
      }
      case 'torrents_removed':
        set(torrentsAtom, removeProducer(value))
        break
      case 'server_state':
        set(serverStateAtom, (prev) => ({ ...prev, ...value }))
        break
    }
  }
})

export const useUpdateMainSync = () => {
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
  }, [data, refreshInterval])
}
