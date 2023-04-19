import { mergeToStorage } from '@/lib/utils'
import { atom } from 'jotai'
import { SetStateAction } from 'react'
import { getTorrentsAtom, storageAtom } from '../atoms'
import { currTorAtom } from '../Torrents/atoms'

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

export const getCurrHashAtom = atom((get) => {
  const currTor = get(currTorAtom)
  const torrents = get(getTorrentsAtom)
  return currTor === -1 ? null : torrents[currTor].hash
})
