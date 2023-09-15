export const MAX_ETA = 8640000
export const MIN_SIDEBAR_WIDTH = 150

export const KEY_PREFIX = 'QB_'

export enum FilePriority {
  Ignored = 0,
  Normal = 1,
  High = 6,
  Maximum = 7,
  Mixed = -1,
}

export enum TriState {
  Unchecked = 0,
  Checked = 1,
  Partial = 2,
}

export const FIX_CATEGORIES = [
  { name: 'All', filterValue: null },
  { name: 'Uncategorized', filterValue: '' },
] as const
