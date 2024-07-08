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
import {
  Categories,
  ServerState,
  SyncData,
  Tags,
  Torrents,
  Trackers,
} from '@/types'

export const mainRidAtom = atom(0)

const updateMainDataAtom = atom(null, (_, set, newData: SyncData) => {
  if (newData.full_update) {
    set(torrentsAtom, newData.torrents as Torrents)
    set(trackersAtom, newData.trackers as Trackers)
    set(categoriesAtom, newData.categories as Categories)
    set(tagsAtom, newData.tags as Tags)
    set(serverStateAtom, newData.server_state as ServerState)
    return
  }

  const updateAtom = <T>(atom: any, updater: (draft: T) => void) => {
    set(atom, produce<T>(updater))
  }

  for (const [key, value] of Object.entries(newData)) {
    switch (key) {
      case 'tags':
        // set(tagsAtom, (prev) => [...prev, ...newData.tags!])
        // set(
        //   tagsAtom,
        //   produce((draft) => draft.push(...value)),
        // )
        updateAtom<Tags>(tagsAtom, (draft) => {
          draft.push(...(value as string[]))
          // return Array.from(new Set(draft))
        })
        break
      case 'tags_removed':
        // set(tagsAtom, (prev) =>
        //   prev.filter((v) => !newData.tags?.includes(v)),
        // )
        set(
          tagsAtom,
          produce((draft) => draft.filter((v) => !value.includes(v))),
        )
        break
      case 'categories':
        // set(categoriesAtom, (prev) => ({ ...prev, ...newData.categories }))
        set(
          categoriesAtom,
          produce((draft) => Object.assign(draft, value)),
        )
        break
      case 'categories_removed':
        // set(categoriesAtom, (prev) =>
        //   Object.fromEntries(
        //     Object.entries(prev).filter(
        //       ([k]) => !newData.categories_removed?.includes(k),
        //     ),
        //   ),
        set(
          categoriesAtom,
          produce((draft) => {
            value?.forEach((key) => delete draft[key])
          }),
        )
        break
      case 'trackers':
        // set(trackersAtom, (prev) => ({ ...prev, ...newData.trackers }))
        set(
          trackersAtom,
          produce((draft) => {
            Object.assign(draft, value)
          }),
        )
        break
      case 'trackers_removed':
        // set(trackersAtom, (prev) =>
        //   Object.fromEntries(
        //     Object.entries(prev).filter(
        //       ([k]) => !newData.trackers_removed?.includes(k),
        //     ),
        //   ),
        // )
        set(
          trackersAtom,
          produce((draft) => {
            value?.forEach((key) => delete draft[key])
          }),
        )
        break
      case 'torrents': {
        // set(torrentsAtom, (prev) => {
        //   const newTors = { ...prev }
        //   for (const [hash, props] of Object.entries(newData.torrents!)) {
        //     if (Object.keys(newTors).includes(hash)) {
        //       newTors[hash] = { ...newTors[hash], ...props }
        //     } else {
        //       newTors[hash] = props
        //     }
        //   }
        //   return newTors
        // })
        set(
          torrentsAtom,
          produce((draft) => {
            Object.entries(value).forEach(([hash, props]) => {
              if (hash in draft) {
                Object.assign(draft[hash], props)
              } else {
                draft[hash] = props
              }
            })
          }),
        )
        break
      }
      case 'torrents_removed':
        // set(torrentsAtom, (prev) =>
        //   Object.fromEntries(
        //     Object.entries(prev).filter(
        //       ([k]) => !newData.torrents_removed?.includes(k),
        //     ),
        //   ),
        // )
        set(
          torrentsAtom,
          produce((draft) => {
            value?.forEach((key) => delete draft[key])
          }),
        )
        break
      case 'server_state':
        // set(serverStateAtom, (prev) => ({ ...prev, ...newData.server_state }))
        set(
          serverStateAtom,
          produce((draft) => {
            Object.assign(draft, value)
          }),
        )
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
