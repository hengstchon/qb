import { useAtom } from 'jotai'
import { useUpdateMainSync } from '@/hooks/useMainSync'
import Details from './Details'
import Sidebar from './Sidebar'
import { openSidebarAtom } from './Sidebar/atoms'
import SidebarResizer from './SidebarResizer'
import StatusBar from './StatusBar'
import Toolbar from './Toolbar'
import Torrents from './Torrents'

const HomePage = () => {
  useUpdateMainSync()
  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {isOpened && (
          <>
            <Sidebar />
            <SidebarResizer />
          </>
        )}

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
