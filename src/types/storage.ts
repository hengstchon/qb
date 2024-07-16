import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

export type SettingsStorage = {
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
  columnVisibility: VisibilityState
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
