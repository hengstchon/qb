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
  sidebarWidth: number
  openSidebar: boolean
  openSidebarStatus: boolean
  openSidebarCategories: boolean
  openSidebarTags: boolean
  openSidebarTrackers: boolean
}

export type TablesStorage = {
  torrentsTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    columnFilters: ColumnFiltersState
    sorting: SortingState
    trackerFilter: string | null
    statusFilter: string | null
  }
  trackersTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
  peersTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
  filesTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
}
