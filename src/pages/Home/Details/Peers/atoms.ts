import { atom } from 'jotai'
import { Peers, PeersData } from '@/lib/types'
import { produce } from 'immer'

export const peersRidAtom = atom(0)

export const peersAtom = atom<Peers>({})

export const updatePeersAtom = atom(null, (_, set, val: PeersData) => {
  if (val.full_update) {
    set(peersAtom, val.peers as Peers)
  } else {
    if (val.peers) {
      set(peersAtom, (prev) => {
        return produce(prev, (draft) => {
          for (const [peer, props] of Object.entries(val.peers!)) {
            if (Object.keys(draft).includes(peer)) {
              draft[peer] = { ...draft[peer], ...props }
            } else {
              draft[peer] = props
            }
          }
        })
      })
    }
    if (val.peers_removed) {
      set(peersAtom, (prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([k]) => !val.peers_removed?.includes(k))
        )
      )
    }
  }
})
