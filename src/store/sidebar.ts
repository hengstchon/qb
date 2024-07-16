import { focusAtom } from 'jotai-optics'
import { settingsAtom } from './storage'

export const openSidebarAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('openSidebar'),
)
export const openSideStatusAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('openSidebarStatus'),
)
export const openSideCatAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('openSidebarCategories'),
)
export const openSideTagsAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('openSidebarTags'),
)
export const openSideTrackersAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('openSidebarTrackers'),
)
