import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/api/endpoints'
import { useEffect } from 'react'
import { refreshIntervalAtom } from '@/pages/Home/atoms'
import {
  peersAtom,
  peersRidAtom,
  updatePeersAtom,
} from '@/pages/Home/Details/Peers/atoms'
import { getCurrHashAtom } from '@/pages/Home/Details/atoms'

export const useTorPeers = () => {
  const [rid, setRid] = useAtom(peersRidAtom)
  console.log('rid: ', rid)

  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const setUpdatePeers = useSetAtom(updatePeersAtom)
  const [peers] = useAtom(peersAtom)
  const [currHash] = useAtom(getCurrHashAtom)

  const { data, mutate } = useSWRImmutable(
    currHash ? API.sync.torrentPeers(currHash, rid) : null,
    {
      onSuccess: (data) => {
        setUpdatePeers(data)
      },
    }
  )

  useEffect(() => {
    if (currHash) {
      mutate(API.sync.torrentPeers(currHash, rid), { revalidate: false })
    }
  }, [currHash])

  useEffect(() => {
    if (!data?.rid) return
    const pollingInterval = refreshInterval
    const id = setTimeout(() => {
      setRid(data.rid)
    }, pollingInterval)
    return () => clearTimeout(id)
  }, [data, refreshInterval])

  console.log('peers: ', Object.values(peers))
  return peers
}
