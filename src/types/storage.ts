import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  ColumnVisibilityState,
  SortingState,
} from '@tanstack/react-table'

export type SettingsStorage = {
  detailsTab: string
  openDetails: boolean
  refreshInterval: number
  openSidebar: boolean
  openSidebarStatus: boolean
  openSidebarCategories: boolean
  openSidebarTags: boolean
  openSidebarTrackers: boolean
}

interface BaseTableState {
  columnOrder: ColumnOrderState
  columnSizing: ColumnSizingState
  columnVisibility: ColumnVisibilityState
  sorting: SortingState
}

export interface TorrentTableState extends BaseTableState {
  columnFilters: ColumnFiltersState
  trackerFilter: string | null
  statusFilter: string | null
}

export type TrackerTableState = BaseTableState

export type PeerTableState = BaseTableState

export type FilesTableState = BaseTableState
