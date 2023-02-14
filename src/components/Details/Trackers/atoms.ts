import { atom } from 'jotai'
import {
  ColumnOrderState,
  ColumnSizingState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { SetStateAction } from 'react'
import { storageAtom } from '@/components/Homepage/atoms'
import { mergeToStorage } from '@/utils'

export const trksColOrderAtom = atom(
  (get) => get(storageAtom).trackersTable.columnOrder,
  (get, set, arg: SetStateAction<ColumnOrderState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'trackersTable.columnOrder',
        typeof arg === 'function' ? arg(get(trksColOrderAtom)) : arg
      )
    )
  }
)

export const trksColSizingAtom = atom(
  (get) => get(storageAtom).trackersTable.columnSizing,
  (get, set, arg: SetStateAction<ColumnSizingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'trackersTable.columnSizing',
        typeof arg === 'function' ? arg(get(trksColSizingAtom)) : arg
      )
    )
  }
)

export const trksColVisiAtom = atom(
  (get) => get(storageAtom).trackersTable.columnVisibility,
  (get, set, arg: SetStateAction<VisibilityState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'trackersTable.columnVisibility',
        typeof arg === 'function' ? arg(get(trksColVisiAtom)) : arg
      )
    )
  }
)

export const trksSortAtom = atom(
  (get) => get(storageAtom).trackersTable.sorting,
  (get, set, arg: SetStateAction<SortingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'trackersTable.sorting',
        typeof arg === 'function' ? arg(get(trksSortAtom)) : arg
      )
    )
  }
)

export const trksRowSeleAtom = atom(
  (get) => get(storageAtom).trackersTable.rowSelection,
  (get, set, arg: SetStateAction<RowSelectionState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'trackersTable.rowSelection',
        typeof arg === 'function' ? arg(get(trksRowSeleAtom)) : arg
      )
    )
  }
)

export const currTrkAtom = atom(-1)
