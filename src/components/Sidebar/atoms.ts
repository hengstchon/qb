import { atom } from 'jotai'
import { SetStateAction } from 'react'
import { storageAtom } from '../Homepage/atoms'

export const openStatusAtom = atom(
  (get) => get(storageAtom).app.openStatus,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      app: {
        ...prev.app,
        openStatus: typeof arg === 'function' ? arg(get(openStatusAtom)) : arg,
      },
    }))
  }
)

export const openCategoriesAtom = atom(
  (get) => get(storageAtom).app.openCategories,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      app: {
        ...prev.app,
        openCategories:
          typeof arg === 'function' ? arg(get(openCategoriesAtom)) : arg,
      },
    }))
  }
)

export const openTagsAtom = atom(
  (get) => get(storageAtom).app.openTags,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      app: {
        ...prev.app,
        openTags: typeof arg === 'function' ? arg(get(openTagsAtom)) : arg,
      },
    }))
  }
)

export const openTrackersAtom = atom(
  (get) => get(storageAtom).app.openTrackers,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      app: {
        ...prev.app,
        openTrackers:
          typeof arg === 'function' ? arg(get(openTrackersAtom)) : arg,
      },
    }))
  }
)
