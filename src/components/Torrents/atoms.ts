import { atom } from 'jotai'
import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { SetStateAction } from 'react'
import { storageAtom } from '@/components/Homepage/atoms'
import { mergeToStorage } from '@/utils'

export const torsColOrderAtom = atom(
  (get) => get(storageAtom).torrentsTable.columnOrder,
  (get, set, arg: SetStateAction<ColumnOrderState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.columnOrder',
        typeof arg === 'function' ? arg(get(torsColOrderAtom)) : arg
      )
    )
  }
)

export const torsColSizingAtom = atom(
  (get) => get(storageAtom).torrentsTable.columnSizing,
  (get, set, arg: SetStateAction<ColumnSizingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.columnSizing',
        typeof arg === 'function' ? arg(get(torsColSizingAtom)) : arg
      )
    )
  }
)

export const torsColVisiAtom = atom(
  (get) => get(storageAtom).torrentsTable.columnVisibility,
  (get, set, arg: SetStateAction<VisibilityState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.columnVisibility',
        typeof arg === 'function' ? arg(get(torsColVisiAtom)) : arg
      )
    )
  }
)

export const torsColFiltersAtom = atom(
  (get) => get(storageAtom).torrentsTable.columnFilters,
  (get, set, arg: SetStateAction<ColumnFiltersState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.columnFilters',
        typeof arg === 'function' ? arg(get(torsColFiltersAtom)) : arg
      )
    )
  }
)

export const torsSortAtom = atom(
  (get) => get(storageAtom).torrentsTable.sorting,
  (get, set, arg: SetStateAction<SortingState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.sorting',
        typeof arg === 'function' ? arg(get(torsSortAtom)) : arg
      )
    )
  }
)

export const torsPagiAtom = atom(
  (get) => get(storageAtom).torrentsTable.pagination,
  (get, set, arg: SetStateAction<PaginationState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.pagination',
        typeof arg === 'function' ? arg(get(torsPagiAtom)) : arg
      )
    )
  }
)

export const torsRowSeleAtom = atom(
  (get) => get(storageAtom).torrentsTable.rowSelection,
  (get, set, arg: SetStateAction<RowSelectionState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'torrentsTable.rowSelection',
        typeof arg === 'function' ? arg(get(torsRowSeleAtom)) : arg
      )
    )
  }
)

export const currentTorHashAtom = atom('')
