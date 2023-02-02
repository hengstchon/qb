import { cn } from '@/utils'
import { atom, useAtomValue } from 'jotai'

export const showSidebarAtom = atom(false)

const Sidebar = () => {
  const showSidebar = useAtomValue(showSidebarAtom)

  return (
    <div className={cn(showSidebar ? 'w-72' : 'w-0', 'flex-none bg-blue-50')}>
      sidebar
    </div>
  )
}

export default Sidebar
