import { atom } from 'jotai'
import { SetStateAction } from 'react'
import { storageAtom } from '../Homepage/atoms'

export const openDetailsAtom = atom(
  (get) => get(storageAtom).app.openDetails,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      app: {
        ...prev.app,
        openDetails:
          typeof arg === 'function' ? arg(get(openDetailsAtom)) : arg,
      },
    }))
  }
)
