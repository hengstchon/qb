import { useEffect } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { API, qbApi, QbApiError } from '@/services'
import { mergeMainData } from '@/services/mainData'
import { SyncController } from '@/services/syncController'
import {
  authAtom,
  authErrorAtom,
  categoriesAtom,
  connectionInfoAtom,
  refreshIntervalAtom,
  serverStateAtom,
  tagsAtom,
  torrentsAtom,
  trackersAtom,
} from '@/store'
import { SyncData } from '@/types'

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
  const refreshInterval = useAtomValue(refreshIntervalAtom)
  const updateMainData = useSetAtom(updateMainDataAtom)
  const setIsAuthed = useSetAtom(authAtom)
  const setAuthError = useSetAtom(authErrorAtom)
  const setConnectionInfo = useSetAtom(connectionInfoAtom)

  useEffect(() => {
    const controller = new SyncController<SyncData>({
      fetch: (rid, signal) => qbApi.getJson(API.sync.maindata(rid), signal),
      onData: updateMainData,
      onError: (error) => {
        if (
          error instanceof QbApiError &&
          [401, 403].includes(error.status ?? 0)
        ) {
          setConnectionInfo(null)
          setIsAuthed(false)
          setAuthError(
            'Your qBittorrent session expired. Please sign in again.',
          )
        }
      },
      interval: () => refreshInterval,
    })
    controller.start()
    return () => controller.stop()
  }, [
    refreshInterval,
    setAuthError,
    setConnectionInfo,
    setIsAuthed,
    updateMainData,
  ])
}
