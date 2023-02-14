import { mergeToStorage } from '@/utils'
import { atom } from 'jotai'
import { SetStateAction } from 'react'
import { storageAtom } from '../Homepage/atoms'

export const openDetailsAtom = atom(
  (get) => get(storageAtom).settings.openDetails,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) =>
      mergeToStorage(
        prev,
        'settings.openDetails',
        typeof arg === 'function' ? arg(get(openDetailsAtom)) : arg
      )
    )
  }
)
