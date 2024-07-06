import { useEffect } from 'react'
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

const curTimeoutIdAtom = atom<ReturnType<typeof setTimeout> | null>(null)

const updateMainDataAtom = atom(null, (_, set, val: SyncData) => {
  if (val.full_update) {
    set(torrentsAtom, val.torrents as Torrents)
    set(trackersAtom, val.trackers as Trackers)
    set(categoriesAtom, val.categories as Categories)
    set(tagsAtom, val.tags as Tags)
    set(serverStateAtom, val.server_state as ServerState)
  } else {
    for (const key in val) {
      switch (key) {
        case 'tags':
          set(tagsAtom, (prev) => [...prev, ...val.tags!])
          break
        case 'tags_removed':
          set(tagsAtom, (prev) => prev.filter((v) => !val.tags?.includes(v)))
          break
        case 'categories':
          set(categoriesAtom, (prev) => ({ ...prev, ...val.categories }))
          break
        case 'categories_removed':
          set(categoriesAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.categories_removed?.includes(k),
              ),
            ),
          )
          break
        case 'trackers':
          set(trackersAtom, (prev) => ({ ...prev, ...val.trackers }))
          break
        case 'trackers_removed':
          set(trackersAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.trackers_removed?.includes(k),
              ),
            ),
          )
          break
        case 'torrents': {
          set(torrentsAtom, (prev) => {
            const newTors = { ...prev }
            for (const [hash, props] of Object.entries(val.torrents!)) {
              if (Object.keys(newTors).includes(hash)) {
                newTors[hash] = { ...newTors[hash], ...props }
              } else {
                newTors[hash] = props
              }
            }
            return newTors
          })
          break
        }
        case 'torrents_removed':
          set(torrentsAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.torrents_removed?.includes(k),
              ),
            ),
          )
          break
        case 'server_state':
          set(serverStateAtom, (prev) => ({ ...prev, ...val.server_state }))
          break
      }
    }
  }
})

export const useUpdateMainSync = () => {
  const [rid, setRid] = useAtom(mainRidAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdateMainData = useSetAtom(updateMainDataAtom)
  const [curTimeoutId, setCurTimeoutId] = useAtom(curTimeoutIdAtom)

  useEffect(() => {
    if (curTimeoutId) {
      clearTimeout(curTimeoutId)
      setRid(rid + 1)
    }
  }, [refreshInterval])

  useSWRImmutable(API.sync.maindata(rid), {
    onSuccess: (data) => {
      // console.log('data.rid: ', data.rid)
      // console.log('refreshInterval:', refreshInterval)

      setUpdateMainData(data)
      if (data.rid) {
        const timeoutId = setTimeout(() => {
          setRid(data.rid)
        }, refreshInterval)
        setCurTimeoutId(timeoutId)
      }
    },
    onErrorRetry: (error, key, _, revalidate, opts) => {
      console.log('onErryrRetry:', error, key, opts)
      // console.log(error.name == 'AbortError')
      const timeoutId = setTimeout(() => {
        console.log('revalidate: ', opts)
        revalidate(opts)
      }, refreshInterval)
      setCurTimeoutId(timeoutId)
    },
  })
}
