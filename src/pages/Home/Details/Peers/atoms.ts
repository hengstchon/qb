import { atom } from 'jotai'
import { Peers, PeersData } from '@/types'
import { storageAtom } from '../../atoms'
import { SetStateAction } from 'react'
import {
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { mergeToStorage } from '@/lib/utils'
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

export const peersColOrderAtom = atom(
  (get) => get(storageAtom).peersTable.columnOrder,
  (get, set, arg: SetStateAction<ColumnOrderState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'peersTable.columnOrder',
        typeof arg === 'function' ? arg(get(peersColOrderAtom)) : arg
      )
    )
  }
)

export const peersColSizingAtom = atom(
  (get) => get(storageAtom).peersTable.columnSizing,
  (get, set, arg: SetStateAction<ColumnSizingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'peersTable.columnSizing',
        typeof arg === 'function' ? arg(get(peersColSizingAtom)) : arg
      )
    )
  }
)

export const peersColVisiAtom = atom(
  (get) => get(storageAtom).peersTable.columnVisibility,
  (get, set, arg: SetStateAction<VisibilityState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'peersTable.columnVisibility',
        typeof arg === 'function' ? arg(get(peersColVisiAtom)) : arg
      )
    )
  }
)

export const peersSortAtom = atom(
  (get) => get(storageAtom).peersTable.sorting,
  (get, set, arg: SetStateAction<SortingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'peersTable.sorting',
        typeof arg === 'function' ? arg(get(peersSortAtom)) : arg
      )
    )
  }
)

export const currRowAtom = atom(-1)
