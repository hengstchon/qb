import { mergeToStorage } from '@/lib/utils'
import { WritableAtom, atom } from 'jotai'
import { SetStateAction } from 'react'
import { getTorrentsAtom, settingsAtom, storageAtom } from '../atoms'
import { currTorAtom } from '../Torrents/atoms'
import { produce } from 'immer'
import { atomWithLocalStorage } from '@/lib/storage'
import { SettingsStorage } from '@/types'

// export const openDetailsAtom = atom(
//   (get) => get(storageAtom).settings.openDetails,
//   (get, set, arg: SetStateAction<boolean>) => {
//     set(storageAtom, (prev) =>
//       mergeToStorage(
//         prev,
//         'settings.openDetails',
//         typeof arg === 'function' ? arg(get(openDetailsAtom)) : arg
//       )
//     )
//   }
// )

// const defaultSettings = {
//   openDetails: false,
//   refreshInterval: 5000,
//   sidebarWidth: 300,
//   openSidebar: true,
//   openSidebarStatus: true,
//   openSidebarCategories: true,
//   openSidebarTags: true,
//   openSidebarTrackers: true,
// }
// const settingsAtom = atomWithLocalStorage<SettingsStorage>(
//   'settings',
//   defaultSettings
// )
function atomWithKey<T>(baseStorageAtom: WritableAtom, key: string) {
  console.log('opendetails')
  return atom(
    (get) => get(baseStorageAtom)[key],
    (get, set, update: SetStateAction<T>) => {
      set(baseStorageAtom, (prev) => {
        const newValue =
          typeof update === 'function' ? update(prev[key]) : update
        return produce(prev, (draft) => {
          draft[key] = newValue
        })
      })
    }
  )
}
export const openDetailsAtom = atomWithKey<boolean>(settingsAtom, 'openDetails')

// export const openDetailsAtom = atom(
//   (get) => get(settingsAtom).openDetails,
//   (_, set, update: SetStateAction<boolean>) => {
//     set(settingsAtom, (prev) => {
//       const newValue =
//         typeof update === 'function' ? update(prev.openDetails) : update
//       return produce(prev, (draft) => {
//         draft.openDetails = newValue
//       })
//     })
//   }
// )

export const getCurrHashAtom = atom((get) => {
  const currTor = get(currTorAtom)
  const torrents = get(getTorrentsAtom)
  return currTor === -1 ? null : torrents[currTor].hash
})
