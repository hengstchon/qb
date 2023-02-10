import { cn } from '@/utils'
import { atom, useAtom } from 'jotai'
import { SetStateAction } from 'react'
import { storageAtom } from '../Homepage/atoms'
import Status from './Status'

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
      className={cn(openSidebar ? 'w-72' : 'w-0', 'flex-none bg-blue-50 p-2')}
    >
      <Status />
    </div>
  )
}

export default Sidebar
