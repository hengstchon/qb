import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/utils/api'
import { useEffect } from 'react'
import { refreshIntervalAtom } from '@/components/Homepage/atoms'
import {
  peersAtom,
  peersRidAtom,
  updatePeersAtom,
} from '@/components/Details/Peers/atoms'
import { getCurrHashAtom } from '@/components/Details/atoms'

export const useTorPeers = () => {
  const [rid, setRid] = useAtom(peersRidAtom)
  console.log('rid: ', rid)

  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdatePeers = useSetAtom(updatePeersAtom)
  const [peers] = useAtom(peersAtom)
  const [currHash] = useAtom(getCurrHashAtom)

  const { data } = useSWRImmutable(
    currHash ? API.sync.torrentPeers(currHash, rid) : null,
    {
      onSuccess: (data) => {
        setUpdatePeers(data)
      },
    }
  )

  useEffect(() => {
    if (!data?.rid) return
    const pollingInterval = refreshInterval
    const id = setTimeout(() => {
      setRid(data.rid)
    }, pollingInterval)
    return () => clearTimeout(id)
  }, [data, refreshInterval])

  return peers
}
