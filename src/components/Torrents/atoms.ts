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
import { atomWithStorage } from 'jotai/utils'
import { SetStateAction } from 'react'

type StorageType = {
  table: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    columnFilters: ColumnFiltersState
    sorting: SortingState
    pagination: PaginationState
    rowSelection: RowSelectionState
  }
}

const storageAtom = atomWithStorage<StorageType>('App', {
  table: {
    columnOrder: [],
    columnSizing: {},
    columnVisibility: {},
    columnFilters: [{ id: 'name', value: '' }],
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 20 },
    rowSelection: {},
  },
})

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
