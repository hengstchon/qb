import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

export type SettingsStorage = {
  themeMode: 'light' | 'dark'
  openDetails: boolean
  refreshInterval: number
  openSidebar: boolean
  openSidebarStatus: boolean
  openSidebarCategories: boolean
  openSidebarTags: boolean
  openSidebarTrackers: boolean
}

interface BaseTableSettings {
  columnOrder: ColumnOrderState
  columnSizing: ColumnSizingState
  columnVisibility: VisibilityState
  sorting: SortingState
}

export interface TorrentTableSettings extends BaseTableSettings {
  columnFilters: ColumnFiltersState
  trackerFilter: string | null
  statusFilter: string | null
}

export type TrackerTableSettings = BaseTableSettings

export type PeerTableSettings = BaseTableSettings

export type FilesTableSettings = BaseTableSettings
