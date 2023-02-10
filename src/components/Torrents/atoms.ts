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

export const columnOrderAtom = atom(
  (get) => get(storageAtom).table.columnOrder,
  (get, set, arg: SetStateAction<ColumnOrderState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: {
          ...prev.table,
          columnOrder: arg(get(columnOrderAtom)),
        },
      }))
    }
  }
)

export const columnSizingAtom = atom(
  (get) => get(storageAtom).table.columnSizing,
  (get, set, arg: SetStateAction<ColumnSizingState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: {
          ...prev.table,
          columnSizing: arg(get(columnSizingAtom)),
        },
      }))
    }
  }
)

export const columnVisibilityAtom = atom(
  (get) => get(storageAtom).table.columnVisibility,
  (get, set, arg: SetStateAction<VisibilityState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: {
          ...prev.table,
          columnVisibility: arg(get(columnVisibilityAtom)),
        },
      }))
    }
  }
)

export const columnFiltersAtom = atom(
  (get) => get(storageAtom).table.columnFilters,
  (get, set, arg: SetStateAction<ColumnFiltersState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: { ...prev.table, columnFilters: arg(get(columnFiltersAtom)) },
      }))
    }
  }
)

export const sortingAtom = atom(
  (get) => get(storageAtom).table.sorting,
  (get, set, arg: SetStateAction<SortingState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: { ...prev.table, sorting: arg(get(sortingAtom)) },
      }))
    }
  }
)

export const paginationAtom = atom(
  (get) => get(storageAtom).table.pagination,
  (get, set, arg: SetStateAction<PaginationState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: { ...prev.table, pagination: arg(get(paginationAtom)) },
      }))
    }
  }
)

export const rowSelectionAtom = atom(
  (get) => get(storageAtom).table.rowSelection,
  (get, set, arg: SetStateAction<RowSelectionState>) => {
    if (typeof arg === 'function') {
      set(storageAtom, (prev) => ({
        ...prev,
        table: { ...prev.table, rowSelection: arg(get(rowSelectionAtom)) },
      }))
    }
  }
)
