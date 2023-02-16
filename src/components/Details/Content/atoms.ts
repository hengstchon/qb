import { atom } from 'jotai'
import { Files, Peers, PeersData } from '@/types'
import { storageAtom } from '@/components/Homepage/atoms'
import { SetStateAction } from 'react'
import {
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { mergeToStorage } from '@/utils'

export const filesAtom = atom<Files>([])

export const filesColOrderAtom = atom(
  (get) => get(storageAtom).filesTable.columnOrder,
  (get, set, arg: SetStateAction<ColumnOrderState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'filesTable.columnOrder',
        typeof arg === 'function' ? arg(get(filesColOrderAtom)) : arg
      )
    )
  }
)

export const filesColSizingAtom = atom(
  (get) => get(storageAtom).filesTable.columnSizing,
  (get, set, arg: SetStateAction<ColumnSizingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'filesTable.columnSizing',
        typeof arg === 'function' ? arg(get(filesColSizingAtom)) : arg
      )
    )
  }
)

export const filesColVisiAtom = atom(
  (get) => get(storageAtom).filesTable.columnVisibility,
  (get, set, arg: SetStateAction<VisibilityState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'filesTable.columnVisibility',
        typeof arg === 'function' ? arg(get(filesColVisiAtom)) : arg
      )
    )
  }
)

export const filesSortAtom = atom(
  (get) => get(storageAtom).filesTable.sorting,
  (get, set, arg: SetStateAction<SortingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'filesTable.sorting',
        typeof arg === 'function' ? arg(get(filesSortAtom)) : arg
      )
    )
  }
)

export const currRowAtom = atom(-1)
