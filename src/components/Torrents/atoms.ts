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

export const columnOrderAtom = atom(
  (get) => get(storageAtom).table.columnOrder,
  (get, set, arg: SetStateAction<ColumnOrderState>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        ['table', 'columnOrder'],
        typeof arg === 'function' ? arg(get(columnOrderAtom)) : arg
      )
    )
  }
)

export const columnSizingAtom = atom(
  (get) => get(storageAtom).table.columnSizing,
  (get, set, arg: SetStateAction<ColumnSizingState>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      table: {
        ...prev.table,
        columnSizing:
          typeof arg === 'function' ? arg(get(columnSizingAtom)) : arg,
      },
    }))
  }
)

export const columnVisibilityAtom = atom(
  (get) => get(storageAtom).table.columnVisibility,
  (get, set, arg: SetStateAction<VisibilityState>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      table: {
        ...prev.table,
        columnVisibility:
          typeof arg === 'function' ? arg(get(columnVisibilityAtom)) : arg,
      },
    }))
  }
)

export const columnFiltersAtom = atom(
  (get) => get(storageAtom).table.columnFilters,
  (get, set, arg: SetStateAction<ColumnFiltersState>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      table: {
        ...prev.table,
        columnFilters:
          typeof arg === 'function' ? arg(get(columnFiltersAtom)) : arg,
      },
    }))
  }
)

export const sortingAtom = atom(
  (get) => get(storageAtom).table.sorting,
  (get, set, arg: SetStateAction<SortingState>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      table: {
        ...prev.table,
        sorting: typeof arg === 'function' ? arg(get(sortingAtom)) : arg,
      },
    }))
  }
)

export const paginationAtom = atom(
  (get) => get(storageAtom).table.pagination,
  (get, set, arg: SetStateAction<PaginationState>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      table: {
        ...prev.table,
        pagination: typeof arg === 'function' ? arg(get(paginationAtom)) : arg,
      },
    }))
  }
)

export const rowSelectionAtom = atom(
  (get) => get(storageAtom).table.rowSelection,
  (get, set, arg: SetStateAction<RowSelectionState>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      table: {
        ...prev.table,
        rowSelection:
          typeof arg === 'function' ? arg(get(rowSelectionAtom)) : arg,
      },
    }))
  }
)

export const currentTorHashAtom = atom('')
