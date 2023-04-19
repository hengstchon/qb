import { useAtom } from 'jotai'
import { useUpdateMainSync } from '@/hooks/useMainSync'
import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import Torrents from './Torrents'
import StatusBar from './StatusBar'
import { openSidebarAtom } from './Sidebar/atoms'
import Details from './Details'
import SidebarDndContext from './Sidebar/SidebarDndContext'

const HomePage = () => {
  useUpdateMainSync()
  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="relative flex flex-1 overflow-hidden">
        <SidebarDndContext>{isOpened && <Sidebar />}</SidebarDndContext>

        <div className="flex min-w-0 flex-1 flex-col">
          <Torrents />
          <Details />
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default HomePage
