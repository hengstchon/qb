import { cn } from '@/utils'
import { atom, useAtom } from 'jotai'
import { SetStateAction } from 'react'
import { storageAtom } from '../Homepage/atoms'
import Categories from './Categories'
import Status from './Status'
import Tags from './Tags'
import Trackers from './Trackers'

export const openSidebarAtom = atom(
  (get) => get(storageAtom).app.openSidebar,
  (get, set, arg: SetStateAction<boolean>) => {
    set(storageAtom, (prev) => ({
      ...prev,
      app: {
        ...prev.app,
        openSidebar:
          typeof arg === 'function' ? arg(get(openSidebarAtom)) : arg,
      },
    }))
  }
)

const Sidebar = () => {
  const [openSidebar] = useAtom(openSidebarAtom)

  return (
    <div
      className={cn(
        openSidebar ? 'w-72' : 'w-0',
        'flex flex-none flex-col gap-2 bg-blue-50 p-2'
      )}
    >
      <Status />
      <Categories />
      <Tags />
      <Trackers />
    </div>
  )
}

export default Sidebar
