import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { API, qbApi } from '@/services'
import { SyncController } from '@/services/syncController'
import {
  getCurrHashAtom,
  peersAtom,
  refreshIntervalAtom,
  updatePeersAtom,
} from '@/store'
import type { PeersData } from '@/types'

export const useTorPeers = () => {
  const refreshInterval = useAtomValue(refreshIntervalAtom)
  const updatePeers = useSetAtom(updatePeersAtom)
  const setPeers = useSetAtom(peersAtom)
  const peers = useAtomValue(peersAtom)
  const currHash = useAtomValue(getCurrHashAtom)

  useEffect(() => {
    setPeers({})
    if (!currHash) return

    const controller = new SyncController<PeersData>({
      fetch: (rid, signal) =>
        qbApi.getJson(API.sync.torrentPeers(currHash, rid), signal),
      onData: updatePeers,
      interval: () => refreshInterval,
    })
    controller.start()
    return () => controller.stop()
  }, [currHash, refreshInterval, setPeers, updatePeers])

  return useMemo(() => Object.values(peers), [peers])
}
