import { produce } from 'immer'
import { atom } from 'jotai'
import { normalizePeersData } from '@/services/normalizers'
import { Peers, PeersData } from '@/types'

export const peersRidAtom = atom(0)

export const peersAtom = atom<Peers>({})

export const applyPeerDelta = (current: Peers, value: PeersData): Peers => {
  if (value.full_update) return (value.peers ?? {}) as Peers

  return produce(current, (draft) => {
    for (const [peer, props] of Object.entries(value.peers ?? {})) {
      draft[peer] = peer in draft ? { ...draft[peer], ...props } : props
    }
    for (const peer of value.peers_removed ?? []) delete draft[peer]
  })
}

export const updatePeersAtom = atom(null, (_, set, value: unknown) => {
  const val: PeersData = normalizePeersData(value)
  set(peersAtom, (current) => applyPeerDelta(current, val))
})
