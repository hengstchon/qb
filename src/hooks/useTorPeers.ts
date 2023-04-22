import { useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/api/endpoints'
import { getCurrHashAtom, refreshIntervalAtom } from '@/pages/Home/atoms'
import {
  peersAtom,
  peersRidAtom,
  updatePeersAtom,
} from '@/pages/Home/Details/Peers/atoms'

export const useTorPeers = () => {
  const [rid, setRid] = useAtom(peersRidAtom)
  // console.log('rid: ', rid)

  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdatePeers = useSetAtom(updatePeersAtom)
  const [peers] = useAtom(peersAtom)
  const [currHash] = useAtom(getCurrHashAtom)

  useSWRImmutable(currHash ? API.sync.torrentPeers(currHash, rid) : null, {
    // keepPreviousData: true,
    onSuccess: (data) => {
      setUpdatePeers(data)
      if (data.rid) {
        setTimeout(() => {
          setRid(data.rid)
        }, refreshInterval)
      }
    },
  })

  // console.log('peers: ', Object.values(peers))
  const peersArr = useMemo(() => Object.values(peers), [peers])
  return peersArr
}
