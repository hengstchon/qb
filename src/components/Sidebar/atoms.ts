import { getRound, mergeToStorage } from '@/utils'
import { atom } from 'jotai'
import { SetStateAction } from 'react'
import { storageAtom } from '../Homepage/atoms'

export const openSideStatusAtom = atom(
  (get) => get(storageAtom).settings.openSidebarStatus,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.openSidebarStatus',
        typeof arg === 'function' ? arg(get(openSideStatusAtom)) : arg
      )
    )
  }
)

export const openSideCatAtom = atom(
  (get) => get(storageAtom).settings.openSidebarCategories,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.openSidebarCategories',
        typeof arg === 'function' ? arg(get(openSideCatAtom)) : arg
      )
    )
  }
)

export const openSideTagsAtom = atom(
  (get) => get(storageAtom).settings.openSidebarTags,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.openSidebarTags',
        typeof arg === 'function' ? arg(get(openSideTagsAtom)) : arg
      )
    )
  }
)

export const openSideTrackersAtom = atom(
  (get) => get(storageAtom).settings.openSidebarTrackers,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.openSidebarTrackers',
        typeof arg === 'function' ? arg(get(openSideTrackersAtom)) : arg
      )
    )
  }
)

export const openSidebarAtom = atom(
  (get) => get(storageAtom).settings.openSidebar,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.openSidebar',
        typeof arg === 'function' ? arg(get(openSidebarAtom)) : arg
      )
    )
  }
)

export const sidebarWidthAtom = atom(
  (get) => get(storageAtom).settings.sidebarWidth,
  (get, set, arg: SetStateAction<number>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.sidebarWidth',
        typeof arg === 'function'
          ? arg(getRound(get(sidebarWidthAtom)))
          : getRound(arg)
      )
    )
  }
)
