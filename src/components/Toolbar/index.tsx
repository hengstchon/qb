import { Button } from '@/ui/Button'
import { LogOutIcon, SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'
import { useAtom, useSetAtom } from 'jotai'
import { isAuthedAtom } from '@/routes/Auth'
import axi from '@/utils/axi'
import { showSidebarAtom } from '../Sidebar'
import { API } from '@/utils/api'
import FilterInput from './FilterInput'

const Toolbar = () => {
  const setIsAuthed = useSetAtom(isAuthedAtom)
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom)

  return (
    <div className="flex h-12 items-center bg-red-50 px-2">
      <Button onClick={() => setShowSidebar((v) => !v)}>
        {showSidebar ? (
          <SidebarCloseIcon className="h-6 w-6" />
        ) : (
          <SidebarOpenIcon className="h-6 w-6" />
        )}
      </Button>
      <Button
        className=""
        onClick={async () => {
          const res = await axi.post(API.logout)
          if (res.status == 200) setIsAuthed(false)
        }}
      >
        <LogOutIcon />
      </Button>
      <FilterInput />
    </div>
  )
}

export default Toolbar
